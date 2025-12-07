import { getPrismaClient } from '../../prisma/client';
import { generateIssueKey } from '../../utils/keyGenerator';
import { NotFoundError, ForbiddenError } from '../../utils/httpErrors';
import { UserContext } from '../../middleware/auth.middleware';
import { IssueStatus } from '../../generated/prisma/client';
import {
   CreateIssueDto,
   UpdateIssueDto,
   IssueListFilters,
   IssueResponse,
   IssueListResponse,
} from './issue.types';

export class IssueService {
   private prisma = getPrismaClient();

   async createIssue(
      data: CreateIssueDto,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const key = await generateIssueKey();

      const issue = await this.prisma.issue.create({
         data: {
            key,
            title: data.title,
            description: data.description,
            priority: data.priority,
            severity: data.severity,
            environment: data.environment,
            status: IssueStatus.NEW,
            reporterId: currentUser.userId,
         },
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToIssueResponse(issue);
   }

   async getIssueById(
      id: number,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const issue = await this.prisma.issue.findUnique({
         where: { id },
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      if (!issue) {
         throw new NotFoundError('Issue not found');
      }

      return this.mapToIssueResponse(issue);
   }

   async listIssues(
      filters: IssueListFilters,
      currentUser: UserContext
   ): Promise<IssueListResponse> {
      const page = filters.page || 1;
      const pageSize = Math.min(filters.pageSize || 20, 100);
      const skip = (page - 1) * pageSize;

      const where: any = {};

      if (filters.status) {
         where.status = filters.status;
      }

      if (filters.assigneeId) {
         where.assigneeId = filters.assigneeId;
      }

      if (filters.reporterId) {
         where.reporterId = filters.reporterId;
      }

      if (filters.search) {
         where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            { key: { contains: filters.search, mode: 'insensitive' } },
         ];
      }

      const [issues, total] = await Promise.all([
         this.prisma.issue.findMany({
            where,
            include: {
               reporter: {
                  select: {
                     id: true,
                     name: true,
                  },
               },
               assignee: {
                  select: {
                     id: true,
                     name: true,
                  },
               },
            },
            orderBy: {
               createdAt: 'desc',
            },
            skip,
            take: pageSize,
         }),
         this.prisma.issue.count({ where }),
      ]);

      return {
         items: issues.map((issue) => this.mapToIssueResponse(issue)),
         page,
         pageSize,
         total,
      };
   }

   async updateIssue(
      id: number,
      data: UpdateIssueDto,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const existingIssue = await this.prisma.issue.findUnique({
         where: { id },
      });

      if (!existingIssue) {
         throw new NotFoundError('Issue not found');
      }

      const issue = await this.prisma.issue.update({
         where: { id },
         data: {
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.priority && { priority: data.priority }),
            ...(data.severity && { severity: data.severity }),
            ...(data.environment !== undefined && { environment: data.environment }),
         },
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToIssueResponse(issue);
   }

   async takeIssue(
      id: number,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const existingIssue = await this.prisma.issue.findUnique({
         where: { id },
      });

      if (!existingIssue) {
         throw new NotFoundError('Issue not found');
      }

      const issue = await this.prisma.issue.update({
         where: { id },
         data: {
            assigneeId: currentUser.userId,
            status: IssueStatus.IN_PROGRESS,
         },
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToIssueResponse(issue);
   }

   async assignIssue(
      id: number,
      assigneeId: number,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const existingIssue = await this.prisma.issue.findUnique({
         where: { id },
      });

      if (!existingIssue) {
         throw new NotFoundError('Issue not found');
      }

      const assignee = await this.prisma.user.findUnique({
         where: { id: assigneeId },
      });

      if (!assignee) {
         throw new NotFoundError('Assignee user not found');
      }

      const updateData: any = {
         assigneeId,
      };

      if (existingIssue.status === IssueStatus.NEW) {
         updateData.status = IssueStatus.IN_PROGRESS;
      }

      const issue = await this.prisma.issue.update({
         where: { id },
         data: updateData,
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToIssueResponse(issue);
   }

   async changeStatus(
      id: number,
      status: IssueStatus,
      currentUser: UserContext
   ): Promise<IssueResponse> {
      const existingIssue = await this.prisma.issue.findUnique({
         where: { id },
      });

      if (!existingIssue) {
         throw new NotFoundError('Issue not found');
      }

      const issue = await this.prisma.issue.update({
         where: { id },
         data: { status },
         include: {
            reporter: {
               select: {
                  id: true,
                  name: true,
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToIssueResponse(issue);
   }

   async subscribe(
      id: number,
      currentUser: UserContext
   ): Promise<{ subscribed: boolean }> {
      const existingIssue = await this.prisma.issue.findUnique({
         where: { id },
      });

      if (!existingIssue) {
         throw new NotFoundError('Issue not found');
      }

      const existingWatcher = await this.prisma.issueWatcher.findUnique({
         where: {
            issueId_userId: {
               issueId: id,
               userId: currentUser.userId,
            },
         },
      });

      if (!existingWatcher) {
         await this.prisma.issueWatcher.create({
            data: {
               issueId: id,
               userId: currentUser.userId,
            },
         });
      }

      return { subscribed: true };
   }

   private mapToIssueResponse(issue: any): IssueResponse {
      return {
         id: issue.id,
         key: issue.key,
         title: issue.title,
         description: issue.description,
         status: issue.status,
         priority: issue.priority,
         severity: issue.severity,
         environment: issue.environment,
         reporter: issue.reporter,
         assignee: issue.assignee,
         createdAt: issue.createdAt,
         updatedAt: issue.updatedAt,
      };
   }
}
