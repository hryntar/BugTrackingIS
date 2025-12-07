export function extractIssueKeysFromText(text: string): string[] {
   if (!text) {
      return [];
   }

   const regex = /BUG-(\d+)/gi;
   const matches = text.matchAll(regex);
   const keys = new Set<string>();

   for (const match of matches) {
      keys.add(match[0].toUpperCase());
   }

   return Array.from(keys);
}
