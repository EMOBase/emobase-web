export const stringToURLHash = (s: string): string => {
  // Convert string to proper url hash
  return s
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};
