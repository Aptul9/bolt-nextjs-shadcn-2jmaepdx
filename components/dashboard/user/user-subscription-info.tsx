"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface User {
  subscriptionType: string;
  status: boolean;
  expiresAt: string;
  remainingSlots?: number;
}

interface UserSubscriptionInfoProps {
  user: User;
}

export function UserSubscriptionInfo({ user }: UserSubscriptionInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Type</span>
          <span>{user.subscriptionType}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={user.status ? "default" : "destructive"}>
            {user.status ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Expires</span>
          <span>{format(new Date(user.expiresAt), "PPP")}</span>
        </div>
        {user.remainingSlots !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Remaining Slots</span>
            <span>{user.remainingSlots}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}