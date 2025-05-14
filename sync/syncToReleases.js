export default function syncToReleases(pages, releaseMap) {
  return pages.map(page => {
    const tags = page.properties.Tags?.multi_select?.map(t => t.name) || [];
    const release = releaseMap[tags.find(tag => releaseMap[tag])] || 'Unassigned';

    return {
      ...page,
      release,
    };
  });
}