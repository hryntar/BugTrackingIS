import { getPrismaClient } from '../prisma/client';

const KEY_PREFIX = 'BUG';

export const generateIssueKey = async (): Promise<string> => {
   const prisma = getPrismaClient();

   const lastIssue = await prisma.issue.findFirst({
      orderBy: {
         id: 'desc',
      },
      select: {
         key: true,
      },
   });

   let nextNumber = 1;

   if (lastIssue && lastIssue.key) {
      const match = lastIssue.key.match(/^BUG-(\d+)$/);
      if (match) {
         nextNumber = parseInt(match[1], 10) + 1;
      }
   }

   return `${KEY_PREFIX}-${nextNumber}`;
};
