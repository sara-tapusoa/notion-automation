const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

(async () => {
  const users = await notion.users.list();

  users.results.forEach((user) => {
    const name = user.name || '(no name)';
    const email = user.person?.email || '(no email)';
    const id = user.id;
    console.log(`👤 ${name} <${email}> — ID: ${id}`);
  });
})();