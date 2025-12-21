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

