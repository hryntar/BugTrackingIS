import { getPrismaClient } from '../../prisma/client';
import { NotFoundError } from '../../utils/httpErrors';
import { UserContext } from '../../middleware/auth.middleware';
import { UpsertCodeChangeDto, CodeChangeResponse } from './codeChange.types';

export class CodeChangeService {
   private prisma = getPrismaClient();

   async listByIssue(
      issueId: number,
      currentUser: UserContext
   ): Promise<CodeChangeResponse[]> {
      const issue = await this.prisma.issue.findUnique({
         where: { id: issueId },
      });

      if (!issue) {
         throw new NotFoundError('Issue not found');
      }

      const issueCodeChanges = await this.prisma.issueCodeChange.findMany({
         where: { issueId },
         include: {
            codeChange: true,
         },
         orderBy: {
            codeChange: {
               occurredAt: 'desc',
            },
         },
      });

      return issueCodeChanges.map((icc) =>
         this.mapToCodeChangeResponse(icc.codeChange)
      );
   }

   async getById(
      id: number,
      currentUser: UserContext
   ): Promise<CodeChangeResponse> {
      const codeChange = await this.prisma.codeChange.findUnique({
         where: { id },
      });

      if (!codeChange) {
         throw new NotFoundError('Code change not found');
      }

      return this.mapToCodeChangeResponse(codeChange);
   }

   async upsertCodeChange(data: UpsertCodeChangeDto): Promise<CodeChangeResponse> {
      const codeChange = await this.prisma.codeChange.upsert({
         where: {
            type_externalId: {
               type: data.type,
               externalId: data.externalId,
            },
         },
         update: {
            title: data.title,
            url: data.url,
            author: data.author,
            occurredAt: data.occurredAt,
         },
         create: {
            type: data.type,
            externalId: data.externalId,
            title: data.title,
            url: data.url,
            author: data.author,
            occurredAt: data.occurredAt,
         },
      });

      return this.mapToCodeChangeResponse(codeChange);
   }

   private mapToCodeChangeResponse(codeChange: any): CodeChangeResponse {
      return {
         id: codeChange.id,
         type: codeChange.type,
         externalId: codeChange.externalId,
         title: codeChange.title,
         url: codeChange.url,
         author: codeChange.author,
         occurredAt: codeChange.occurredAt,
         createdAt: codeChange.createdAt,
         updatedAt: codeChange.updatedAt,
      };
   }
}
