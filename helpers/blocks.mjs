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

export const calloutBlock = (text, emoji = "💡", url = null, options = {}) => {
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