import { google } from 'googleapis';
import fs from 'fs/promises';
import 'dotenv/config';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

/**
 * Initializes and returns an authorized Google OAuth2 client.
 */
export default async function authorize() {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
  
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('❌ Missing Google API credentials in .env file.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  try {
    const token = await fs.readFile(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.error('🔐 Authorization required. Visit this URL:');
    console.error(authUrl);
    throw new Error(`Token not found or invalid. Run \`get-token.mjs\` to generate one.`);
  }
}