import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { IssueStatus, IssueListFilters, User } from "@/lib/types";
import { useState, useEffect } from "react";

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READY_FOR_QA", label: "Ready for QA" },
  { value: "REOPENED", label: "Reopened" },
  { value: "CLOSED", label: "Closed" },
];

interface IssuesFilterProps {
  filters: IssueListFilters;
  onFiltersChange: (filters: IssueListFilters) => void;
  users: User[];
}

export function IssuesFilter({ filters, onFiltersChange, users }: IssuesFilterProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === "all" ? undefined : (value as IssueStatus),
      page: 1,
    });
  };

  const handleAssigneeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      assigneeId: value === "all" ? undefined : parseInt(value),
      page: 1,
    });
  };

  const handleReporterChange = (value: string) => {
    onFiltersChange({
      ...filters,
      reporterId: value === "all" ? undefined : parseInt(value),
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchInput("");
    onFiltersChange({ page: 1, pageSize: filters.pageSize });
  };

  const hasActiveFilters = filters.status || filters.assigneeId || filters.reporterId || filters.search;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="min-w-[160px]">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[160px]">
        <label className="text-sm font-medium mb-2 block">Assignee</label>
        <Select value={filters.assigneeId?.toString() || "all"} onValueChange={handleAssigneeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[160px]">
        <label className="text-sm font-medium mb-2 block">Reporter</label>
        <Select value={filters.reporterId?.toString() || "all"} onValueChange={handleReporterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All reporters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reporters</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="default" onClick={handleReset} className="gap-2">
          <X className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
