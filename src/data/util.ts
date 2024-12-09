export const generateId = () => {
  return Math.random().toString(16).substring(2, 15);
};

export const remToPx = (rem: number, document: Document) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}