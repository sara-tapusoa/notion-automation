import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const listUsers = async () => {
  const { results } = await notion.users.list();

  results.forEach(user => {
    const name = user.name || '(no name)';
    const email = user.person?.email || '(no email)';
    console.log(`👤 ${name.padEnd(25)} <${email}> — ID: ${user.id}`);
  });
};

listUsers().catch(console.error);