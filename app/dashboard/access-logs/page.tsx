"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import Link from "next/link";

interface AccessLog {
  id: string;
  timestamp: string;
  door: number;
  success: boolean;
  user: {
    id: string;
    name: string;
  };
}

interface PaginationMeta {
  currentPage: number;
  previousPage: number | null;
  hasNextPage: boolean;
}

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    let url = `/api/supabase/access-logs/?page=${currentPage}`;

    if (date?.from) {
      url += `&startDate=${date.from.toISOString()}`;
    }
    if (date?.to) {
      url += `&endDate=${date.to.toISOString()}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch access logs");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, date]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && meta?.hasNextPage !== undefined) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-8 max-md:mt-3.5">
      <h1 className="text-3xl font-bold">Access Logs</h1>

      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[300px]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {date && (
          <Button
            variant="ghost"
            onClick={() => setDate(undefined)}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Door</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[60px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[60px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))
              : logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.timestamp), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(log.timestamp), "HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/users/${log.user.id}`}
                        className="hover:underline cursor-pointer"
                      >
                        {log.user.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      Door {log.door}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={log.success ? "default" : "destructive"}>
                        {log.success ? "Success" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {meta && (currentPage > 1 || meta.hasNextPage) && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!meta.hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
