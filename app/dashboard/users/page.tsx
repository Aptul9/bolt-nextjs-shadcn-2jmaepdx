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

interface User {
  id: string;
  name: string;
  subscriptionType: string;
  status: boolean;
  userInfo: {
    email: string;
    phoneNumber: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/fake/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.data));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.userInfo.email}</TableCell>
                <TableCell>{user.userInfo.phoneNumber}</TableCell>
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
    </div>
  );
}