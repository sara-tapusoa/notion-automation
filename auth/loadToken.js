import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export async function getAuthorizedClient(label = 'default') {
  const tokenPath = path.resolve(`token.${label}.json`);
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    const tokenData = await fs.readFile(tokenPath, 'utf8');
    oAuth2Client.setCredentials(JSON.parse(tokenData));
    return oAuth2Client;
  } catch (err) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log(`🔗 Visit this URL in your browser:\n${authUrl}\n`);

    throw new Error(
      `No token file found for label "${label}". Use get-token.mjs to generate one.`
    );
  }
}