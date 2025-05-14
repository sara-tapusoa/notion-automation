import { google } from 'googleapis';
import fs from 'fs/promises';
import 'dotenv/config';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// ⬇️ Paste the auth code you got from the browser here:
const code = '4/0Ab_5qllmpAci15t9G0Mjs8Ln9u5CD32TtVMcwXG5JUkRwoSekUu8pb1eYPLjW39O8m2x8w&scope=https://www.googleapis.com/auth/calendar.readonly';

const { tokens } = await oAuth2Client.getToken(code);
await fs.writeFile('token.json', JSON.stringify(tokens));
console.log('✅ Token saved to token.json');

