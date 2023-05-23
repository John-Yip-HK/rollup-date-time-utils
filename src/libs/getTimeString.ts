export const getTimeString = (
  date: Date | string = new Date(),
  parseConfig?: Intl.DateTimeFormatOptions
): string => {
  const dateToBeParsed = typeof date === 'string' ? new Date(date) : date;

  return dateToBeParsed.toLocaleTimeString('en-hk', {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...parseConfig,
  });
};