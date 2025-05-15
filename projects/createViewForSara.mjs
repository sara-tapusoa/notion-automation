import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import {
  paragraphBlock,
  headingBlock,
  dividerBlock,
  calloutBlock,
  multiColumnNavBlock,
  columnBlock,
  multiStyledRichText,
  bold,
  italic,
  strikethrough,
  code,
  h1,
  h2,
  h3,

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
        url: "https://raw.githubusercontent.com/sara-tapusoa/notion-automation/main/assets/sara.svg"
      }
    },
    cover: {
      type: "external",
      external: {
        url: "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzkyMXwwfDF8c2VhcmNofDI1fHxkZXNpZ258ZW58MHx8fHwxNzQ3MjUwMDY2fDA&ixlib=rb-4.1.0&q=80&w=200"
      }
    }
  });

  const pageId = page.id;

  const blocks = [
    multiColumnNavBlock(
      [
        { heading: "Navigation", url: "" },
        { label: "Home", url: `https://www.notion.so/${PRODUCT_HOME}` },
        { label: "Projects", url: `https://www.notion.so/${ROADMAP_ID}` },
        { label: "Product Meeting", url: `https://www.notion.so/${TASKS_DATABASE_ID}` },
        { label: "Product Framework", url: `https://www.notion.so/${PRODUCT_HOME}` },
      ],
      5
    ),
    dividerBlock(),
    columnBlock([
      [calloutBlock(
        multiStyledRichText([
          { "My Tasks": bold, color: "green" },

          { "Is this going to work": bold, italic },
          { "This is like a heading": bold, italic },
          "This is a normal text",
        ]),
      )],
      [calloutBlock(
        "Product Wiki",
        "🟦",
        null,
        
          headingBlock("Product Wiki", 1)
       
      )],
    ]),

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
