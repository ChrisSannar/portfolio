export const generateId = () => {
  return Math.random().toString(16).substring(2, 15);
};