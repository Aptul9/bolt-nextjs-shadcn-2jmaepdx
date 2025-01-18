"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewUserDialog } from "@/components/dashboard/new-user-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  subscriptionType: string;
  status: boolean;
}

interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  hasNextPage: boolean;
}

interface Filters {
  status?: boolean;
  expiringOnly?: boolean;
}

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = async (search?: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const baseUrl = "/api/supabase/users";
      let url = search
        ? `${baseUrl}/search?q=${search}&page=${page}`
        : `${baseUrl}/?page=${page}`;

      if (filters.status !== undefined) {
        url += `&status=${filters.status}`;
      }
      if (filters.expiringOnly) {
        url += "&expiringOnly=true";
      }

      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.data || []);
      setPaginationMeta(data.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(debouncedSearch, currentPage);
  }, [debouncedSearch, filters, currentPage]);

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value === "active",
    }));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4 md:space-y-8 max-md:mt-3.5 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button
            onClick={() => setIsNewUserDialogOpen(true)}
            className="md:hidden flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New User
          </Button>
        </div>
        <div className="relative w-full md:w-72">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1); // Reset to first page when clearing search
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={
              filters.status === undefined
                ? "all"
                : filters.status
                ? "active"
                : "inactive"
            }
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="max-md:w-[150px] md:w-[180px] w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="ml-3.5"
            variant={filters.expiringOnly ? "secondary" : "outline"}
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                expiringOnly: !prev.expiringOnly,
              }));
              setCurrentPage(1); // Reset to first page when toggling filter
            }}
          >
            Expiring Soon
          </Button>

          {(filters.status !== undefined || filters.expiringOnly) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-muted-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <Button
          onClick={() => setIsNewUserDialogOpen(true)}
          className="hidden md:flex"
        >
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleUserClick(user.id)}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.subscriptionType}</TableCell>
                  <TableCell>
                    <Badge variant={user.status ? "default" : "destructive"}>
                      {user.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginationMeta && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)} // Move to the previous page
            disabled={currentPage === 1} // Disable if on the first page
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)} // Move to the next page
            disabled={!paginationMeta.hasNextPage} // Disable if there is no next page
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <NewUserDialog
        isOpen={isNewUserDialogOpen}
        onClose={() => setIsNewUserDialogOpen(false)}
      />
    </div>
  );
}
