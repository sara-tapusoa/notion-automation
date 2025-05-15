import { google } from 'googleapis';
import fs from 'fs/promises';
import readline from 'readline/promises';
import path from 'path';
import 'dotenv/config';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('❌ Missing Google API credentials in .env file.');
}

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Utility to resolve token paths for multiple accounts
const getTokenPath = (label) =>
  path.resolve(`token.${label ? label.toLowerCase() : 'default'}.json`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const label = await rl.question('🔐 Account label (e.g., personal, work): ');
const tokenPath = getTokenPath(label.trim() || 'default');

// Try refreshing token first if it exists
try {
  const existing = await fs.readFile(tokenPath, 'utf8');
  const credentials = JSON.parse(existing);
  oAuth2Client.setCredentials(credentials);

  if (credentials.refresh_token) {
    const res = await oAuth2Client.refreshAccessToken();
    await fs.writeFile(tokenPath, JSON.stringify(res.credentials, null, 2));
    console.log(`🔄 Token refreshed and saved to ${tokenPath}`);
    process.exit(0);
  }
} catch {
  // Ignore if token file doesn't exist or refresh fails
}

// Prompt for new token
console.log('\n👉 Visit this URL to authorize:');
console.log(
  oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
);

const code = await rl.question('\nPaste the authorization code here: ');
rl.close();

try {
  const { tokens } = await oAuth2Client.getToken(code.trim());
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
  console.log(`✅ Token saved to ${tokenPath}`);
} catch (err) {
  console.error('❌ Failed to retrieve token:', err.message);
  process.exit(1);
}