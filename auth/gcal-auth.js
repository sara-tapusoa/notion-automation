// gcal-auth.js
import { google } from 'googleapis';
import fs from 'fs/promises';
import 'dotenv/config';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

export default async function authorize() {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    const token = await fs.readFile(TOKEN_PATH, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch {
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('👉 Visit this URL to authorize the app:', authUrl);
    throw new Error('🔐 You need to authorize the app and save the token.json');
  }
}