export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
