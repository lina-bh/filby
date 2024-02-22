export const $ = <T>(selector: string): T => {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    throw new Error("ref error " + selector);
  }
  if (elements.length === 1) {
    return elements[0] as T;
  }
  return [...elements] as T;
};

export const id = <T extends HTMLElement>(selector: string): T => {
  const element = document.getElementById(selector);
  if (!element) {
    throw new Error("reference error: " + selector);
  }
  return element as T;
};
