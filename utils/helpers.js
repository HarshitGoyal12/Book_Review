/**
 * Helper functions for the application
 */

// Format date to readable format
exports.formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Calculate reading time for book description
exports.calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};