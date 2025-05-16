import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const createTestPage = async () => {
  const res = await notion.pages.create({
    parent: { database_id: process.env.NOTION_PRODUCT_WIKI_DB_ID },
    properties: {
      Name: {
        title: [{ text: { content: '🧪 Test Page' } }],
      },
    },
  });

  console.log(`✅ Created test page: https://www.notion.so/${res.id.replace(/-/g, '')}`);
};

createTestPage().catch(console.error);