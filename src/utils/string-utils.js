import { 
  VERSION_PREFIX_PATTERN, 
  BULLET_POINT_PATTERN, 
  EXCLUDED_CHANGELOG_PHRASES 
} from './constants.js';

export const extractVersionPrefix = (version) => {
  if (!version) return null;
  const match = version.match(VERSION_PREFIX_PATTERN);
  return match ? match[1] : null;
};

export const cleanAuthorMention = (text) => {
  if (!text) return text;
  return text
    .replace(/\s+by @\S+/g, '')
    .replace(/\s+in https?:\/\/\S+/g, '');
};

export const extractFirstChangeFromNotes = (releaseNotes) => {
  if (!releaseNotes) return '';
  
  const lines = releaseNotes.split('\n');
  const changes = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    const match = trimmedLine.match(BULLET_POINT_PATTERN);
    
    if (match) {
      const hasExcludedPhrase = EXCLUDED_CHANGELOG_PHRASES.some(
        phrase => trimmedLine.includes(phrase)
      );
      
      if (!hasExcludedPhrase) {
        const cleanedText = cleanAuthorMention(match[1]);
        changes.push(cleanedText);
      }
    }
  }
  
  return changes[0] || '';
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) : text;
};

export const padText = (text, width) => {
  return (text || '').padEnd(width);
};

