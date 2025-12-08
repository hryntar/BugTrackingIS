import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Issue, IssueStatus } from "@/lib/types";

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READY_FOR_QA", label: "Ready for QA" },
  { value: "REOPENED", label: "Reopened" },
  { value: "CLOSED", label: "Closed" },
];

interface ChangeStatusDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (issueId: number, status: IssueStatus) => void;
  isLoading?: boolean;
}

export function ChangeStatusDialog({ issue, open, onOpenChange, onChangeStatus, isLoading }: ChangeStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | "">("");

  const handleChangeStatus = () => {
    if (selectedStatus && issue) {
      onChangeStatus(issue.id, selectedStatus);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedStatus("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>Change status for {issue?.key}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as IssueStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions
                  .filter((option) => option.value !== issue?.status)
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          <Button onClick={handleChangeStatus} disabled={!selectedStatus || isLoading}>
            {isLoading ? "Changing..." : "Change Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
