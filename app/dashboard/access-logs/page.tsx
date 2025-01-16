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
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
//TODO: Cambiare, non va bene supabaseAdmin ora serve solo per cercare nei tenants
import { supabaseAdmin } from "@/utils/supabase";
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

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    let url = `/api/supabase/access-logs/`;

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
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch access logs");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  const handleRealtimeUpdate = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();

    const channel = supabaseAdmin
      .channel("access_logs_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "access_logs" },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      supabaseAdmin.removeChannel(channel).catch((error) => {
        console.error("Error cleaning up subscription:", error);
      });
    };
  }, [fetchLogs, handleRealtimeUpdate]);

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
    </div>
  );
}
