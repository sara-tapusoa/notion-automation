import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const response = await notion.search({
  filter: {
    property: "object",
    value: "database"
  }
});

for (const db of response.results) {
  console.log(`🗂 ${db.title[0]?.plain_text || "Untitled DB"} — ID: ${db.id}`);
}