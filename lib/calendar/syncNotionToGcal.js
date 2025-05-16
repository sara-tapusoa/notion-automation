export default async function syncNotionToGcal(notion, gcal, databaseId) {
  const pages = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'GCal Event ID',
      rich_text: {
        is_empty: true,
      },
    },
  });

  for (const page of pages.results) {
    const title = page.properties['Event Title']?.title?.[0]?.plain_text;
    const start = page.properties.Date?.date?.start;
    const end = page.properties.Date?.date?.end || start;
    const description = page.properties.Description?.rich_text?.[0]?.plain_text || '';

    const res = await gcal.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        description: `${description}\n\n[SOURCE: Notion Sync]`,
        start: { dateTime: start },
        end: { dateTime: end },
        extendedProperties: {
          private: {
            source: 'notion-sync',
          },
        },
      },
    });

    await notion.pages.update({
      page_id: page.id,
      properties: {
        'GCal Event ID': {
          rich_text: [{ text: { content: res.data.id } }],
        },
      },
    });
  }
}
