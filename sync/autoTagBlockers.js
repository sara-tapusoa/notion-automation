export default function autoTagBlockers(pages, keywords = ['blocked', 'waiting', 'stuck']) {
  return pages.map(page => {
    const content = page.properties.Description?.rich_text?.[0]?.plain_text?.toLowerCase() || '';
    const isBlocked = keywords.some(word => content.includes(word));

    return {
      ...page,
      isBlocked,
    };
  });
}