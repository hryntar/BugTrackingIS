import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Issue, User } from "@/lib/types";

interface AssignIssueDialogProps {
  issue: Issue | null;
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (issueId: number, assigneeId: number) => void;
  isLoading?: boolean;
}

export function AssignIssueDialog({ issue, users, open, onOpenChange, onAssign, isLoading }: AssignIssueDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const handleAssign = () => {
    if (selectedUserId && issue) {
      onAssign(issue.id, parseInt(selectedUserId));
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedUserId("");
    }
    onOpenChange(newOpen);
  };

  const devUsers = users.filter((user) => user.role === "DEV" && user.active);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Issue</DialogTitle>
          <DialogDescription>Assign {issue?.key} to a developer</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Developer</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a developer" />
              </SelectTrigger>
              <SelectContent>
                {devUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUserId || isLoading}>
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
