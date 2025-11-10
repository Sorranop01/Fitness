/**
 * Format date to Thai locale string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('th-TH', options).format(date);
}

/**
 * Format date to display time (HH:MM)
 */
export function formatTime(date: Date): string {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date to display full date and time
 */
export function formatDateTime(date: Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format date to display short date (DD/MM/YYYY)
 */
export function formatShortDate(date: Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
