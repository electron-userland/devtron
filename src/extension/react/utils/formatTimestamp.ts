export default function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
}
