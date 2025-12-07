import { CodeChangeType } from '../../generated/prisma/client';

export interface UpsertCodeChangeDto {
   type: CodeChangeType;
   externalId: string;
   title: string;
   url: string;
   author: string;
   occurredAt: Date;
}

export interface CodeChangeResponse {
   id: number;
   type: CodeChangeType;
   externalId: string;
   title: string;
   url: string;
   author: string;
   occurredAt: Date;
   createdAt: Date;
   updatedAt: Date;
}
