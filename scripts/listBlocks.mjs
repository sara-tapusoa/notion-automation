#!/usr/bin/env node
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = process.env.NOTION_TEMPLATE_PAGE_ID;
const SOURCE_BLOCK_ID = process.env.NOTION_SOURCE_BLOCK_ID;

async function listBlocks() {
  const res = await notion.blocks.children.list({
    block_id: PAGE_ID,
    page_size: 100
  });

  console.log(JSON.stringify(res.results, null, 2));
}


listBlocks().catch(console.error);