export const getDateString = (date: Date | string = new Date()): string => {
  const dateToBeParsed = typeof date === 'string' ? new Date(date) : date;

  return dateToBeParsed
    .toLocaleDateString('en-hk', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');
};