# 🧱 Notion Automation Toolkit

A growing suite of scripts to automate workflows with the Notion API — for creating pages, copying complex blocks like callouts with children, or generating custom dashboards like the "My View."

---

## 🚀 Setup

Before using the scripts, ensure you have:

1. **Node.js** installed
2. A valid **Notion integration token**
3. A properly configured `.env` file:

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxx
NOTION_PRODUCT_WIKI_DB_ID=xxxxxxxxxxxxxxxxxxxx
NOTION_TEMPLATE_PAGE_ID=xxxxxxxxxxxxxxxxxxxx
```

## 🔐 Permissions & Installation

Make the scripts executable by running this in your terminal:
```bash
chmod +x scripts/*.mjs
```

Link this CLI locally. From the project root, run:
```bash
npm install -g .
```

This enables global usage of commands like:
```bash
listBlocks
listDatabases
listPages
listUsers
```

## 📁 Scripts Overview

**`listBlocks.mjs`**

> **Purpose:**
> Lists blocks on a Notion page, or copies a block's content from one page to another. This is useful as a workaround for duplicating complex blocks or layouts (such as callouts, dividers, and nested blocks) that otherwise is not possible to create via the API. Note that this works for all types of objects in the API except for objects like `button` which is not supported yet.

**Usage Example:**

- List top-level blocks in a page (e.g., from an `.env` variable):
```bash
listBlocks
```
You'll be prompted:
"What .env ID variable do you want to use?"

- List children blocks from a specific block:
```bash
listBlocks children
```
You'll be prompted for a block ID.

- Copy a block (and its children) to another block:
```bash
listBlocks copy
```
You'll be prompted for:
- Source block ID
- Destination block/page ID

⚠️ Note: Not all block types are supported by Notion's API. Blocks like buttons will cause validation errors. Unfortunately, they are not exposed in the Notion API yet.

**`listDatabases.mjs`**

> **Purpose:**
> Lists all databases the integration has access to.

**Usage Example:**

- List databases from the NOTION_TEMPLATE_PAGE_ID (or whatever ID variable you set in your `.env`):
```bash
listDatabases
```

**`listPages.mjs`**

> **Purpose:**
> Lists pages inside a database like NOTION_PROJECT_WIKI_DB_ID.

**Usage Example:**

- List pages from the NOTION_DB_ID (or whatever ID variable you set in your `.env`):
```bash
listPages
```

**`listUsers.mjs`**

> **Purpose:**
> Lists users connected to the integration (useful for debugging user permissions).

**Usage Example:**

- List users from a database:
```bash
listUsers
```

## 📌 Notes

- Add `#!/usr/bin/env node` to the top of every .mjs file to make it executable.
- Keep `.env` safe. Never push secrets to version control.
- The Notion API does not yet support copying all block types (like buttons). Use the block-copy script with awareness of limitations.
- This project is written using native ES modules. Scripts must use `.mjs` or `.js` or be compiled.
- You can extend this CLI by adding more commands to package.json > bin.
  
## Thanks!

---

Let me know if you want to automate adding usage flags like `--help`, or create a `docs/` folder for script-specific usage examples!