"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface User {
  name: string;
  subscriptionType: string;
  status: boolean;
  expiresAt: string;
  remainingSlots?: number;
}

interface UserSubscriptionInfoProps {
  user: User;
  isEditing: boolean;
  editedUser: User | null;
  onUserChange: (field: string, value: any) => void;
}

export function UserSubscriptionInfo({ user, isEditing, editedUser, onUserChange }: UserSubscriptionInfoProps) {
  const handleNameChange = (value: string) => {
    if (value.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }
    onUserChange("name", value);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={editedUser?.name || ""}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="subscriptionType">Subscription Type</Label>
            <Select
              value={editedUser?.subscriptionType}
              onValueChange={(value) => {
                onUserChange("subscriptionType", value);
                if (value !== "Slots") {
                  onUserChange("remainingSlots", null);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subscription type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Slots">Slots</SelectItem>
                <SelectItem value="Unlimited">Unlimited</SelectItem>
                <SelectItem value="H24">24/7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={editedUser?.status ? "active" : "inactive"}
              onValueChange={(value) => onUserChange("status", value === "active")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !editedUser?.expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedUser?.expiresAt ? (
                    format(new Date(editedUser.expiresAt), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(editedUser?.expiresAt || "")}
                  onSelect={(date) =>
                    onUserChange("expiresAt", date?.toISOString())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {editedUser?.subscriptionType === "Slots" && (
            <div>
              <Label htmlFor="remainingSlots">Remaining Slots</Label>
              <Input
                id="remainingSlots"
                type="number"
                min="0"
                value={editedUser?.remainingSlots || 0}
                onChange={(e) =>
                  onUserChange("remainingSlots", parseInt(e.target.value) || 0)
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

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