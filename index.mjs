import 'dotenv/config';
import cron from 'node-cron';
import { google } from 'googleapis';

import authorize from './auth/gcal-auth.js';
import notion from './auth/notion.js';

import syncEvents from './sync/syncGcalToNotion.js';
import syncNotionToGcal from './sync/syncNotionToGcal.js';
import resolveAttendees from './helpers/resolveAttendees.js';

const databaseId = process.env.NOTION_CALENDAR_DB_ID;

// 🕒 Schedule to run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('🔁 Running 10-minute sync cycle...');
  const auth = await authorize();
  const gcal = google.calendar({ version: 'v3', auth });

  await syncEvents(auth, databaseId);
  await syncNotionToGcal(notion, gcal, databaseId);

  console.log('✅ Sync complete');
});

// 🧪 Optional: Manual test page creation
async function createTestPage() {
  const mockEvent = {
    summary: '🌟 Native App Sync',
    attendees: [
      { email: 'stapusoa@travelpassgroup.com' },
      { email: 'mike@travelpassgroup.com' },
    ],
  };

  const attendeeEmails = mockEvent.attendees.map(a => a.email);
  const notionPeople = await resolveAttendees(attendeeEmails);

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      'Event Title': {
        title: [{ text: { content: mockEvent.summary } }],
      },
      Attendees: {
        people: notionPeople,
      },
    },
  });

  console.log(`✅ Page created with attendees: ${attendeeEmails.join(', ')}`);
}

// Uncomment to test manually
// await createTestPage();
