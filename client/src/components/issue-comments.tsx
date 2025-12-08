import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Edit2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { issueService } from "@/services/issue.service";
import type { Comment, User } from "@/lib/types";

interface IssueCommentsProps {
  issueId: number;
  currentUser: User;
}

export function IssueComments({ issueId, currentUser }: IssueCommentsProps) {
  const queryClient = useQueryClient();
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => issueService.getComments(issueId),
  });

  const createMutation = useMutation({
    mutationFn: (text: string) => issueService.createComment(issueId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
      setNewCommentText("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) => issueService.updateComment(commentId, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
      setEditingCommentId(null);
      setEditText("");
    },
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      createMutation.mutate(newCommentText);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const handleSubmitEdit = (commentId: number) => {
    if (editText.trim()) {
      updateMutation.mutate({ commentId, text: editText });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="group relative rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {comment.isSystem ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">System</span>
                            <Badge variant="secondary" className="text-xs">
                              Auto
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">{comment.author?.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{comment.author?.name || "Unknown"}</div>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!comment.isSystem && comment.author?.id === currentUser.id && editingCommentId !== comment.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(comment)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[80px]"
                      disabled={updateMutation.isPending}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSubmitEdit(comment.id)} disabled={updateMutation.isPending || !editText.trim()}>
                        {updateMutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={updateMutation.isPending}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmitNew} className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="min-h-[100px]"
            disabled={createMutation.isPending}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={createMutation.isPending || !newCommentText.trim()} size="sm">
              {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Post Comment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
