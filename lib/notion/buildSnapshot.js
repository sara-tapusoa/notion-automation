export default function buildSnapshot(events, teamMap) {
  return events.map(event => {
    const team = teamMap[event.attendees?.[0]?.email] || 'Unknown';
    return {
      title: event.summary,
      date: event.start?.dateTime || event.start?.date,
      team,
      hasMeet: !!event.hangoutLink,
    };
  });
}