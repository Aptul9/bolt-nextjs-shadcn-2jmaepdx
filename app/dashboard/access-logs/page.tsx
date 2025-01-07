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

  useEffect(() => {
    fetch("/api/fake/access-logs")
      .then((res) => res.json())
      .then((data) => setLogs(data.data));
  }, []);

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
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.timestamp), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{format(new Date(log.timestamp), "HH:mm")}</TableCell>
                <TableCell className="font-medium">{log.user.name}</TableCell>
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