"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfo {
  email: string;
  phoneNumber: string;
  address?: string;
}

interface User {
  userInfo: UserInfo;
}

interface UserContactInfoProps {
  user: User;
}

export function UserContactInfo({ user }: UserContactInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Email</span>
          <span>{user.userInfo.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Phone</span>
          <span>{user.userInfo.phoneNumber}</span>
        </div>
        {user.userInfo.address && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Address</span>
            <span>{user.userInfo.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}