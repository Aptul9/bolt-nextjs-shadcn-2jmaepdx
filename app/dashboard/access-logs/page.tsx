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
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DateRange } from "react-day-picker";
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

  const fetchLogs = async () => {
    setIsLoading(true);
    let url = `/api/supabase/access-logs?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080`;
    if (date?.from) url += `&startDate=${date.from.toISOString()}`;
    if (date?.to) url += `&endDate=${date.to.toISOString()}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [date]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Access Logs</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
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
                      <Skeleton className="h-4 w-[200px]" />
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
                    <TableCell className="font-medium">
                      {log.user.name}
                    </TableCell>
                    <TableCell>{log.user.userInfo.email}</TableCell>
                    <TableCell>Door {log.door}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
