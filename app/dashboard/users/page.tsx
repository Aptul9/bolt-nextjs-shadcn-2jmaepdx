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
import { Search, X, Plus } from "lucide-react";
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

interface Filters {
  status?: boolean;
  expiringOnly?: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = async (search?: string) => {
    setIsLoading(true);
    try {
      const baseUrl = "/api/supabase/users";
      let url = search
        ? `${baseUrl}/search?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080&q=${search}`
        : `${baseUrl}?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080`;

      if (filters.status !== undefined) {
        url += `&status=${filters.status}`;
      }
      if (filters.expiringOnly) {
        url += "&expiringOnly=true";
      }

      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch, filters]);

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value === "active",
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-4 md:space-y-8 max-md:mt-3.5">
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7"
              onClick={() => setSearchQuery("")}
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
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                expiringOnly: !prev.expiringOnly,
              }))
            }
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
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
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
              : users.map((user) => (
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
                ))}
          </TableBody>
        </Table>
      </div>

      <NewUserDialog
        isOpen={isNewUserDialogOpen}
        onClose={() => setIsNewUserDialogOpen(false)}
      />
    </div>
  );
}
