import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const dbId = process.env.NOTION_PRODUCT_WIKI_DB_ID;

const db = await notion.databases.retrieve({ database_id: dbId });

console.log("🧠 Properties in your Product wiki:");
for (const [key, value] of Object.entries(db.properties)) {
  const marker = value.type === 'title' ? ' ← ✅ THIS IS THE TITLE PROPERTY' : '';
  console.log(`• ${key} (${value.type})${marker}`);
}