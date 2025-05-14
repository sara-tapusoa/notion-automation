import { google } from 'googleapis';
import resolveAttendees from '../helpers/resolveAttendees.js';
import notion from '../auth/notion.js';
import { BLOCKED_TITLE_KEYWORDS, SYNC_WINDOW_DAYS, SYNC_CUTOFF_DAYS } from './filters.js';

export default async function syncEvents(auth, databaseId) {
  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  const windowEnd = new Date();
  windowEnd.setDate(now.getDate() + SYNC_WINDOW_DAYS);

  const midpoint = new Date();
  midpoint.setDate(now.getDate() + SYNC_CUTOFF_DAYS);

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: windowEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = res.data.items || [];

  for (const event of events) {
    const title = event.summary?.toLowerCase() || '';
    const eventStart = new Date(event.start?.dateTime || event.start?.date);

    if (
      BLOCKED_TITLE_KEYWORDS.some(keyword => title.includes(keyword)) ||
      eventStart > midpoint
    ) {
      console.log(`⏭ Skipping filtered event: "${event.summary}"`);
      continue;
    }

    const existing = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'GCal Event ID',
        rich_text: {
          equals: event.id,
        },
      },
    });

    if (existing.results.length > 0) {
      console.log(`⏭ Already synced: "${event.summary}"`);
      continue;
    }

    const attendeeEmails = (event.attendees || []).map(a => a.email);
    const notionPeople = await resolveAttendees(attendeeEmails);

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Event Title': {
          title: [{ text: { content: event.summary || '(No title)' } }],
        },
        'Attendees': {
          people: notionPeople,
        },
        'Date': {
          date: {
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
          },
        },
        'Description': {
          rich_text: [{ text: { content: event.description || '' } }],
        },
        'Google Meet Link': {
          rich_text: [{ text: { content: event.hangoutLink || '' } }],
        },
        'GCal Event ID': {
          rich_text: [{ text: { content: event.id } }],
        },
      },
    });

    console.log(`✅ Synced: "${event.summary}"`);
  }
} 
