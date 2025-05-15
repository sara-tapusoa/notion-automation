import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const TEMPLATE_PAGE_ID = process.env.NOTION_TEMPLATE_PAGE_ID;
const SOURCE_BLOCK_ID = process.env.NOTION_SOURCE_BLOCK_ID;

const sanitizeBlock = (block) => {
  if (!block.type) return null;

  const sanitized = {
    object: "block",
    type: block.type,
    [block.type]: block[block.type],
  };

  // remove disallowed fields
  delete sanitized[sanitized.type].id;
  delete sanitized[sanitized.type].created_time;
  delete sanitized[sanitized.type].last_edited_time;

  // remove null icon
  if (sanitized.type === "callout" && sanitized.callout.icon === null) {
    delete sanitized.callout.icon;
  }

  // remove children key
  delete sanitized.children;

  return sanitized;
};

const copyCalloutWithChildren = async () => {
  // Step 1: Get the original callout block
  const sourceBlock = await notion.blocks.retrieve({ block_id: SOURCE_BLOCK_ID });

  if (sourceBlock.type !== "callout") {
    throw new Error("Block is not a callout.");
  }

  // Step 2: Get its children
  const childrenResp = await notion.blocks.children.list({ block_id: SOURCE_BLOCK_ID });
  const childBlocks = childrenResp.results.map(sanitizeBlock).filter(Boolean);

  // Step 3: Create new page in the same database
  const newPage = await notion.pages.create({
    parent: { database_id: process.env.NOTION_PRODUCT_WIKI_DB_ID },
    properties: {
      "Page Type": {
        title: [{ type: "text", text: { content: "Copied Template Block" } }]
      },
      Tags: {
        multi_select: [{ name: "Copied" }]
      }
    }
  });

  // Step 4: Add the copied callout block to new page
  const createdCallout = await notion.blocks.children.append({
    block_id: newPage.id,
    children: [sanitizeBlock(sourceBlock)]
  });

  const newCalloutId = createdCallout.results[0].id;

  // Step 5: Append children into the new callout block
  if (childBlocks.length > 0) {
    await notion.blocks.children.append({
      block_id: newCalloutId,
      children: childBlocks
    });
  }

  console.log(`✅ Copied to: https://www.notion.so/${newPage.id.replace(/-/g, "")}`);
};

copyCalloutWithChildren().catch(console.error);