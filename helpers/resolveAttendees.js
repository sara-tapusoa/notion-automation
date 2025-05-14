import notion from '../auth/notion.js';

export default async function resolveAttendees(emailList = []) {
  const { results } = await notion.users.list();

  const emailToIdMap = {};
  for (const user of results) {
    if (user.object === 'user' && user.person?.email) {
      emailToIdMap[user.person.email.toLowerCase()] = user.id;
    }
  }

  return emailList
    .map(email => emailToIdMap[email.toLowerCase()])
    .filter(Boolean)
    .map(id => ({ id }));
}