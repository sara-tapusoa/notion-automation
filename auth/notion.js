import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NOTION_TOKEN) {
  throw new Error("❌ NOTION_TOKEN is missing from the environment.");
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default notion;