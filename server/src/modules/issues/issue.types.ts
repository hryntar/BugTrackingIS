import { IssueStatus, IssuePriority, IssueSeverity } from '../../generated/prisma/client';

export interface CreateIssueDto {
   title: string;
   description: string;
   priority: IssuePriority;
   severity: IssueSeverity;
   environment?: string;
}

export interface UpdateIssueDto {
   title?: string;
   description?: string;
   priority?: IssuePriority;
   severity?: IssueSeverity;
   environment?: string;
}

export interface IssueListFilters {
   status?: IssueStatus;
   assigneeId?: number;
   reporterId?: number;
   search?: string;
   page?: number;
   pageSize?: number;
}

export interface IssueResponse {
   id: number;
   key: string;
   title: string;
   description: string;
   status: IssueStatus;
   priority: IssuePriority;
   severity: IssueSeverity;
   environment: string | null;
   reporter: {
      id: number;
      name: string;
   };
   assignee: {
      id: number;
      name: string;
   } | null;
   createdAt: Date;
   updatedAt: Date;
}

export interface IssueListResponse {
   items: IssueResponse[];
   page: number;
   pageSize: number;
   total: number;
}
