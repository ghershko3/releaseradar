import chalk from 'chalk';
import { TABLE_WIDTHS } from '../utils/constants.js';

export const createSeparator = (length) => {
  return chalk.dim('─'.repeat(length));
};

export const createTableHeader = (columns) => {
  return columns.map(col => col.text.padEnd(col.width)).join(' ');
};

export const createTableRow = (values, widths) => {
  return values.map((value, index) => 
    (value || '').padEnd(widths[index])
  ).join(' ');
};

export const printTable = ({ headers, separator }) => {
  console.log(headers);
  console.log(createSeparator(separator));
};

export const createReleasesTableHeader = () => {
  return {
    headers: createTableHeader([
      { text: 'TAG', width: TABLE_WIDTHS.TAG },
      { text: 'DATE', width: TABLE_WIDTHS.DATE },
      { text: 'AUTHOR', width: TABLE_WIDTHS.AUTHOR },
      { text: 'CHANGES', width: TABLE_WIDTHS.CHANGES }
    ]),
    separator: TABLE_WIDTHS.SEPARATOR_FULL
  };
};

