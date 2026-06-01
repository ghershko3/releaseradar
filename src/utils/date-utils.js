export const formatIsoDate = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

export const getTimestamp = (dateString) => {
  return new Date(dateString).getTime();
};

export const isNewerThan = (date1, date2) => {
  return getTimestamp(date1) > getTimestamp(date2);
};

export const parseDuration = (input) => {
  const match = /^(\d+)([mhd])$/.exec((input || '').trim());
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const multipliers = { m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[match[2]];
};

export const isWithinLast = (dateString, durationMs, now = Date.now()) =>
  now - getTimestamp(dateString) <= durationMs;

