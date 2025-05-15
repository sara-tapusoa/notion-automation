export default function resolveCalendar(email, calendarMap) {
  return calendarMap[email.toLowerCase()] || 'primary';
}