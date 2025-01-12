"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  isEditing: boolean;
  editedUser: User | null;
  onUserChange: (field: string, value: any) => void;
}

export function UserDetails({ user, isEditing, editedUser, onUserChange }: UserDetailsProps) {
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedUser?.userInfo.birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedUser?.userInfo.birthDate ? (
                    format(new Date(editedUser.userInfo.birthDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedUser?.userInfo.birthDate ? new Date(editedUser.userInfo.birthDate) : undefined}
                  onSelect={(date) =>
                    onUserChange("userInfo.birthDate", date?.toISOString())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="birthPlace">Birth Place</Label>
            <Input
              id="birthPlace"
              value={editedUser?.userInfo.birthPlace || ""}
              onChange={(e) =>
                onUserChange("userInfo.birthPlace", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={editedUser?.userInfo.nationality || ""}
              onChange={(e) =>
                onUserChange("userInfo.nationality", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={editedUser?.userInfo.gender}
              onValueChange={(value) =>
                onUserChange("userInfo.gender", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={editedUser?.userInfo.emergencyContact || ""}
              onChange={(e) =>
                onUserChange("userInfo.emergencyContact", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editedUser?.userInfo.notes || ""}
              onChange={(e) =>
                onUserChange("userInfo.notes", e.target.value)
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