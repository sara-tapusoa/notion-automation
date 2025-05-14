import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import {
  paragraphBlock,
  headingBlock,
  dividerBlock,
  calloutBlock,
} from '../helpers/blocks.mjs';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PRODUCT_HOME = process.env.NOTION_PRODUCT_WIKI_DB_ID;
const ROADMAP_ID = process.env.NOTION_PRODUCT_ROADMAP_DB_ID;
const TASKS_DATABASE_ID = process.env.NOTION_TASKS_DATABASE_ID;

const createSaraView = async () => {
  const page = await notion.pages.create({
    parent: { database_id: PRODUCT_HOME },
    properties: {
      "Page Type": {
        title: [{ type: "text", text: { content: "Hello, Sara" } }]
      },
      Tags: {
        multi_select: [{ name: "Ops View" }]
      }
    },
    icon: {
      type: "external",
      external: {
        url: "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F082b4df4-d654-4e2e-bc78-db9adc529dd9%2Fsara.svg?table=custom_emoji&id=1f3fc0e0-7c99-8078-a484-007a81179612&spaceId=583daeb3-13cb-49bd-8b46-36f05afd8ba5&userId=7164e0fd-d3cc-45e0-8e74-1c4f472eb26e&cache=v2"
      }
    }
  });

  const pageId = page.id;

  const blocks = [
    calloutBlock("Back to Product", "⬅️", `https://www.notion.so/${PRODUCT_HOME}`),
    dividerBlock(),

    ...["Discovery", "Definition", "Design", "Development"].map(label =>
      paragraphBlock(label, `https://www.notion.so/${PRODUCT_HOME}#${label.toLowerCase()}`)
    ),

    dividerBlock(),
    headingBlock("⚡ Quick Actions", 2),
    dividerBlock(),
    paragraphBlock("👋 TODO: Replace the fake callouts below with real buttons in Notion"),

    ...[
      "Create Research Plan",
      "Create Research Analysis",
      "Create Task",
      "Create PRD",
      "Create New Release",
    ].map((action) =>
      calloutBlock(
        `🚧 [REPLACE WITH BUTTON] ${action}`,
        "🟩",
        `https://www.notion.so/${PRODUCT_HOME}/new?template=${encodeURIComponent(action)}`
      )
    ),

    headingBlock("Product Roadmap", 1),
    paragraphBlock("View Full Roadmap", `https://www.notion.so/${ROADMAP_ID}`),

    headingBlock("My Tasks", 2),
    dividerBlock(),
    paragraphBlock("Go to Task Board", `https://www.notion.so/${TASKS_DATABASE_ID}`)

  ]

  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks.filter(Boolean)
  });

  console.log(`✅ Sara's view created: https://www.notion.so/${pageId.replace(/-/g, "")}`);
};

createSaraView().catch(console.error);
