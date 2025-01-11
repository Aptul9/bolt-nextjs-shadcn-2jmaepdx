"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AccessLog {
  id: string;
  timestamp: string;
  door: number;
}

interface UserAccessLogsProps {
  userId: string;
}

export function UserAccessLogs({ userId }: UserAccessLogsProps) {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/supabase/access-logs/${userId}`, {
          headers: {
            "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch access logs");
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching access logs:", error);
        toast.error("Failed to load access logs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Access Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Door</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(log.timestamp), "HH:mm")}
                  </TableCell>
                  <TableCell>Door {log.door}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No access logs found
          </div>
        )}
      </CardContent>
    </Card>
  );
}