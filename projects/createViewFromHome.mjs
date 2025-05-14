import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const WIKI_DATABASE_ID = process.env.NOTION_PRODUCT_WIKI_DB_ID;

const createHomeLayoutPage = async ({ title, tag, personalTasks, links }) => {
  const page = await notion.pages.create({
    parent: { database_id: WIKI_DATABASE_ID },
    properties: {
      "Page Type": {
        title: [{ text: { content: title } }]
      },
      Tags: {
        multi_select: [{ name: tag }]
      }
    }
  });

  const pageId = page.id;

  const children = [
    {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "💡" },
        rich_text: [
          {
            type: "text",
            text: {
              content: "This is your personalized product dashboard. Use the quick actions below to stay focused."
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_1",
      heading_1: {
        rich_text: [{ type: "text", text: { content: "🧠 Welcome to the Product Wiki" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Here’s your personalized product view with quick links and priorities."
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "🔗 Quick Links" } }]
      }
    },
    ...links.map(link => ({
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: {
              content: link.label,
              link: { url: link.url }
            }
          }
        ]
      }
    })),
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "📌 Current Priorities" } }]
      }
    },
    ...personalTasks.map(task => ({
      object: "block",
      type: "to_do",
      to_do: {
        rich_text: [{ type: "text", text: { content: task } }],
        checked: false
      }
    }))
  ];

  await notion.blocks.children.append({
    block_id: pageId,
    children
  });

  const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, "")}`;
  console.log(`✅ Created page: ${notionUrl}`);
};

// 🔧 Example usage
createHomeLayoutPage({
  title: "👤 Sara’s View",
  tag: "Ops View",
  personalTasks: [
    "Check blockers across all products",
    "Review release notes",
    "Log feedback from exec sync"
  ],
  links: [
    { label: "🗺 Product Roadmap", url: "https://www.notion.so/YOUR_ROADMAP_PAGE_ID" },
    { label: "🚀 Release Planning", url: "https://www.notion.so/YOUR_RELEASE_PAGE_ID" },
    { label: "📄 Full Product Dashboard", url: "https://www.notion.so/YOUR_MASTER_PAGE_ID" }
  ]
});