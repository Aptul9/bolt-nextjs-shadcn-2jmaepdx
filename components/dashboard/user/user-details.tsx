"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface UserInfo {
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  gender?: string;
  emergencyContact?: string;
  notes?: string;
}

interface User {
  userInfo: UserInfo;
}

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.userInfo.birthDate && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Birth Date</span>
            <span>{format(new Date(user.userInfo.birthDate), "PPP")}</span>
          </div>
        )}
        {user.userInfo.birthPlace && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Birth Place</span>
            <span>{user.userInfo.birthPlace}</span>
          </div>
        )}
        {user.userInfo.nationality && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Nationality</span>
            <span>{user.userInfo.nationality}</span>
          </div>
        )}
        {user.userInfo.gender && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Gender</span>
            <span>{user.userInfo.gender}</span>
          </div>
        )}
        {user.userInfo.emergencyContact && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Emergency Contact</span>
            <span>{user.userInfo.emergencyContact}</span>
          </div>
        )}
        {user.userInfo.notes && (
          <div className="space-y-2">
            <span className="text-muted-foreground">Notes</span>
            <p className="text-sm">{user.userInfo.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}