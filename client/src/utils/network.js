import { formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  const date = formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  return date;
};