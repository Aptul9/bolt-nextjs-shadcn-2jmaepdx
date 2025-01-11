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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

const TENANT_ID = "de51a5d5-0648-484c-9a29-88b39c2b0080";

interface AccessLog {
  id: string;
  timestamp: string;
  door: number;
  user: {
    name: string;
    subscriptionType: string;
    userInfo: {
      email: string;
    };
  };
}

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    let url = `/api/supabase/access-logs?tenantId=${TENANT_ID}`;

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

    const channel = supabase
      .channel("access_logs_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "access_logs" }, handleRealtimeUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch((error) => {
        console.error("Error cleaning up subscription:", error);
      });
    };
  }, [fetchLogs, handleRealtimeUpdate]);

  return (
    <div className="space-y-8">
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
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
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
              <TableHead>Door</TableHead>
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
                    <TableCell>
                      <Skeleton className="h-4 w-[60px]" />
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
                    <TableCell className="font-medium">{log.user.name}</TableCell>
                    <TableCell>Door {log.door}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
