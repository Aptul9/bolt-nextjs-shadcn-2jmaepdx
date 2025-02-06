"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContactInfoProps } from "@/types/types";


export function UserContactInfo({ user, isEditing, editedUser, onUserChange }: UserContactInfoProps) {
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editedUser?.userInfo.email || ""}
              onChange={(e) =>
                onUserChange("userInfo.email", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editedUser?.userInfo.phoneNumber || ""}
              onChange={(e) =>
                onUserChange("userInfo.phoneNumber", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={editedUser?.userInfo.address || ""}
              onChange={(e) =>
                onUserChange("userInfo.address", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }

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