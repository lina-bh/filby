/**
 * @param {string} selector
 * @returns {HTMLElement | HTMLElement[]}
 */
export const $ = (selector) => {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    throw new Error("ref error " + selector);
  }
  if (elements.length === 1) {
    return elements[0];
  }
  return elements;
};
