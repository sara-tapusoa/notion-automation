export const bold = Symbol("bold");
export const italic = Symbol("italic");
export const underline = Symbol("underline");
export const strikethrough = Symbol("strikethrough");
export const code = Symbol("code");
export const h1 = Symbol("h1");
export const h2 = Symbol("h2");
export const h3 = Symbol("h3");

export const detectHeadingLevel = (symbols = []) => {
  if (symbols.some(([_, v]) => v === h1)) return 1;
  if (symbols.some(([_, v]) => v === h2)) return 2;
  if (symbols.some(([_, v]) => v === h3)) return 3;
  return null;
};

export const paragraphBlock = (text, url = null) => ({
  type: "paragraph",
  paragraph: {
    rich_text: [
      {
        type: "text",
        text: { content: text, link: url ? { url } : null }
      }
    ]
  }
});

export const headingBlock = (text, level = 2) => ({
  type: `heading_${level}`,
  [`heading_${level}`]: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const dividerBlock = () => ({
  type: "divider",
  divider: {}
});

export const fakeButtonBlock = (text, emoji = "💡", url = null, options = {}) => {
  const tag = options.tagForManualButton ? "🚧 [REPLACE WITH BUTTON] " : "";
  return {
    type: "callout",
    callout: {
      icon: { type: "emoji", emoji },
      rich_text: [
        {
          type: "text",
          text: {
            content: tag + text,
            link: url ? { url } : null
          }
        }
      ]
    }
  };
};

export const calloutBlock = (
  richTextContent = "Default Callout Text",
  emoji = "💡",
  url = null,
  options = {}
) => {
  let richText;

  if (typeof richTextContent === "string") {
    richText = [
      {
        type: "text",
        text: {
          content: richTextContent,
          link: url ? { url } : null
        }
      }
    ];
  } else if (
    Array.isArray(richTextContent) &&
    richTextContent.every((item) => item?.type === "text" || item?.type === "mention" || item?.type === "equation")
  ) {
    richText = richTextContent;
  } else {
    throw new Error(
      "calloutBlock expects a string or rich_text[] for the main content."
    );
  }

  return {
    type: "callout",
    callout: {
      icon: emoji ? { type: "emoji", emoji } : undefined,
      rich_text: richText
    },
    ...(options.children ? { children: options.children } : {})
  };
};

export const multiStyledRichText = (lines) => {
  return lines.map((entry, i) => {
    if (typeof entry === "string") {
      return {
        type: "text",
        text: { content: (i > 0 ? "\n" : "") + entry },
        annotations: {}
      };
    }

    const symbols = Object.entries(entry).filter(([key, val]) => typeof val === "symbol");

    const textKey = Object.keys(entry).find(k => typeof k === "string");
    const content = textKey || "";
    const text = (i > 0 ? "\n" : "") + content;

    const color = typeof entry.color === "string" ? entry.color : "default";

    const annotations = {
      bold: symbols.some(([_, v]) => v === bold),
      italic: symbols.some(([_, v]) => v === italic),
      underline: symbols.some(([_, v]) => v === underline),
      strikethrough: symbols.some(([_, v]) => v === strikethrough),
      code: symbols.some(([_, v]) => v === code),
      color
    };

    // Filter out heading symbols — not valid in rich_text
    const hasHeading = symbols.some(([_, v]) => v === h1 || v === h2 || v === h3);
    if (hasHeading) {
      console.warn(`⚠️ Warning: "${text.trim()}" contains a heading symbol (h1/h2/h3) which is not valid inside rich_text and will be ignored.`);
    }

    return {
      type: "text",
      text: { content: text },
      annotations
    };
  });
};


export const bulletedListItemBlock = (text, url = null) => ({
  type: "bulleted_list_item",
  bulleted_list_item: {
    rich_text: [
      {
        type: "text",
        text: { content: text, link: url ? { url } : null }
      }
    ]
  }
});

export const numberedListItemBlock = (text) => ({
  type: "numbered_list_item",
  numbered_list_item: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const toDoBlock = (text, checked = false) => ({
  type: "to_do",
  to_do: {
    rich_text: [{ type: "text", text: { content: text } }],
    checked
  }
});

export const toggleBlock = (text, children = []) => ({
  type: "toggle",
  toggle: {
    rich_text: [{ type: "text", text: { content: text } }],
    children
  }
});

export const quoteBlock = (text) => ({
  type: "quote",
  quote: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const codeBlock = (code, language = "javascript") => ({
  type: "code",
  code: {
    rich_text: [{ type: "text", text: { content: code } }],
    language
  }
});

export const imageBlock = (url, caption = "") => ({
  type: "image",
  image: {
    type: "external",
    external: { url },
    caption: caption ? [{ type: "text", text: { content: caption } }] : []
  }
});

export const bookmarkBlock = (url) => ({
  type: "bookmark",
  bookmark: { url }
});

export const tableOfContentsBlock = () => ({
  type: "table_of_contents",
  table_of_contents: {}
});

export const linkToPageBlock = (url) => ({
  type: "link_to_page",
  link_to_page: {
    type: "external",
    external: { url }
  }
});

export const childPageBlock = (title) => ({
  type: "child_page",
  child_page: { title }
});

export const syncedBlock = (blockId, children = []) => ({
  type: "synced_block",
  synced_block: {
    synced_from: { block_id: blockId },
    children
  }
});

export const columnBlock = (columnBlocks) => {
  return {
    type: "column_list",
    column_list: {
      children: columnBlocks.map((children) => ({
        type: "column",
        column: {
          children
        }
      }))
    }
  };
};

export const tableBlock = (rows) => ({
  type: "table",
  table: {
    table_width: rows[0]?.length || 1,
    has_column_header: true,
    has_row_header: false,
    children: rows.map((cells) => ({
      type: "table_row",
      table_row: {
        cells: cells.map((text) => [
          { type: "text", text: { content: text } }
        ])
      }
    }))
  }
});

export const breadcrumbBlock = (text) => ({
  type: "breadcrumb",
  breadcrumb: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const breadcrumbListBlock = (items) => ({
  type: "breadcrumb_list",
  breadcrumb_list: {
    items: items.map((item) => ({
      type: "breadcrumb_item",
      breadcrumb_item: {
        rich_text: [{ type: "text", text: { content: item } }]
      }
    }))
  }
});

export const tableRowBlockWithChildren = (cells, children) => ({
  type: "table_row",
  table_row: {
    cells: cells.map((text) => [
      { type: "text", text: { content: text } }
    ]),
    children
  }
});

export const tableRowBlockWithChildrenAndHeader = (cells, children) => ({
  type: "table_row",
  table_row: {
    cells: cells.map((text) => [
      { type: "text", text: { content: text } }
    ]),
    children,
    has_column_header: true
  }
});

export const tableRowBlockWithHeader = (cells) => ({
  type: "table_row",
  table_row: {
    cells: cells.map((text) => [
      { type: "text", text: { content: text } }
    ]),
    has_column_header: true
  }
});

export const tableRowBlockWithHeaderAndChildren = (cells, children) => ({
  type: "table_row",
  table_row: {
    cells: cells.map((text) => [
      { type: "text", text: { content: text } }
    ]),
    children,
    has_column_header: true
  }
});

export const tableRowBlock = (cells) => ({
  type: "table_row",
  table_row: {
    cells: cells.map((text) => [
      { type: "text", text: { content: text } }
    ])
  }
});

export const tableCellBlock = (text) => ({
  type: "table_cell",
  table_cell: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const tableHeaderBlock = (text) => ({
  type: "table_header",
  table_header: {
    rich_text: [{ type: "text", text: { content: text } }]
  }
});

export const richText = (text, { bold = false, color = "default", link = null } = {}) => ({
  type: "text",
  text: { content: text, link: link ? { url: link } : null },
  annotations: { bold, color }
});

export const paragraphRichBlock = (textArray) => ({
  type: "paragraph",
  paragraph: {
    rich_text: textArray
  }
});

export const multiColumnNavBlock = (items) => ({
  type: "column_list",
  column_list: {
    children: items.map(({ heading, label, url, asCallout = false }) => {
      const children = [];
      if (heading) {
        children.push(paragraphRichBlock([richText(heading, { bold: true })]));
      }
      if (label && url) {
        if (asCallout) {
          children.push(calloutBlock(label, "🟩", url));
        } else {
          children.push(paragraphRichBlock([richText(label, { color: "green", link: url })]));
        }
      }
      return {
        type: "column",
        column: { children }
      };
    })
  }
});