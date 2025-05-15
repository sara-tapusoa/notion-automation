#!/usr/bin/env node
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const sanitizeBlock = (block) => {
  if (!block.type) return null;

  const sanitized = {
    object: "block",
    type: block.type,
    [block.type]: block[block.type],
  };

  delete sanitized[sanitized.type].id;
  delete sanitized[sanitized.type].created_time;
  delete sanitized[sanitized.type].last_edited_time;

  if (sanitized.type === "callout" && sanitized.callout.icon === null) {
    delete sanitized.callout.icon;
  }

  delete sanitized.children;

  return sanitized;
};

const listBlocks = async (blockId, label = "blocks") => {
  const res = await notion.blocks.children.list({ block_id: blockId, page_size: 100 });
  const blocks = res.results.map(sanitizeBlock).filter(Boolean);
  blocks.forEach(b => console.log(JSON.stringify(b, null, 2)));
  console.log(`🧱 Total ${label}: ${blocks.length}`);
};

const copyBlockWithChildren = async (sourceId, destPageId) => {
  const sourceBlock = await notion.blocks.retrieve({ block_id: sourceId });
  const childrenRes = await notion.blocks.children.list({ block_id: sourceId });
  const children = childrenRes.results.map(sanitizeBlock).filter(Boolean);

  const mainBlock = sanitizeBlock(sourceBlock);
  const created = await notion.blocks.children.append({
    block_id: destPageId,
    children: [mainBlock]
  });

  const newBlockId = created.results[0]?.id;
  if (children.length && newBlockId) {
    await notion.blocks.children.append({
      block_id: newBlockId,
      children
    });
  }

  console.log(`✅ Block copied to https://notion.so/${destPageId.replace(/-/g, "")}`);
};

(async () => {
  const [,, command, ...args] = process.argv;

  if (command === "children") {
    const blockId = await ask("🔍 Enter block ID to list children from: ");
    await listBlocks(blockId.trim(), "child blocks");

  } else if (command === "copy") {
    const sourceId = await ask("📦 Source block ID to copy from: ");
    const destId = await ask("📥 Destination block/page ID to paste into: ");
    await copyBlockWithChildren(sourceId.trim(), destId.trim());

  } else {
    const envKey = await ask("🔧 Which .env variable contains the ID? (e.g. NOTION_TEMPLATE_PAGE_ID): ");
    const id = process.env[envKey.trim()];
    if (!id) {
      console.error("❌ That key wasn’t found in your .env");
    } else {
      await listBlocks(id, "blocks");
    }
  }

  rl.close();
})();