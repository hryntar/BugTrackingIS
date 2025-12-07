export interface CreateCommentDto {
   text: string;
}

export interface UpdateCommentDto {
   text: string;
}

export interface CommentResponse {
   id: number;
   author: {
      id: number;
      name: string;
   } | null;
   text: string;
   isSystem: boolean;
   createdAt: Date;
   updatedAt: Date;
}
