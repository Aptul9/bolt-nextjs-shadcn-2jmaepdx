"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserInfo {
  email: string;
  phoneNumber: string;
  address?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  gender?: string;
  emergencyContact?: string;
  notes?: string;
}

interface User {
  id: string;
  name: string;
  subscriptionType: string;
  status: boolean;
  expiresAt: string;
  remainingSlots?: number;
  userInfo: UserInfo;
}

interface AccessLog {
  id: string;
  timestamp: string;
  door: number;
}

interface UserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (user: User) => void;
}

export function UserDialog({
  user,
  isOpen,
  onClose,
  onUserUpdate,
}: UserDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchAccessLogs();
    }
  }, [user, isOpen]);

  const fetchAccessLogs = async () => {
    if (!user) return;

    setIsLoadingLogs(true);
    try {
      const response = await fetch(`/api/supabase/access-logs/${user.id}`, {
        headers: {
          "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch access logs");
      const data = await response.json();
      setAccessLogs(data);
    } catch (error) {
      console.error("Error fetching access logs:", error);
      toast.error("Failed to load access logs");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!user) return null;

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/supabase/user-info/${editedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
        },
        body: JSON.stringify(editedUser.userInfo),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = { ...user, ...editedUser };
      onUserUpdate(updatedUser);
      setIsEditing(false);
      toast.success("User information updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex justify-between items-center">
            <span>{user.name}</span>
            {!isEditing ? (
              <Button onClick={handleEdit}>Edit</Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Subscription Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {user.subscriptionType}
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  {user.status ? "Active" : "Inactive"}
                </p>
                <p>
                  <span className="text-muted-foreground">Expires:</span>{" "}
                  {format(new Date(user.expiresAt), "PPP")}
                </p>
                {user.remainingSlots !== undefined && (
                  <p>
                    <span className="text-muted-foreground">
                      Remaining Slots:
                    </span>{" "}
                    {user.remainingSlots}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editedUser?.userInfo.email || ""}
                        onChange={(e) =>
                          setEditedUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  userInfo: {
                                    ...prev.userInfo,
                                    email: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedUser?.userInfo.phoneNumber || ""}
                        onChange={(e) =>
                          setEditedUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  userInfo: {
                                    ...prev.userInfo,
                                    phoneNumber: e.target.value,
                                  },
                                }
                              : null
                          )
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {user.userInfo.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {user.userInfo.phoneNumber}
                    </p>
                  </>
                )}
              </div>
            </div>

            {(isEditing || user.userInfo.address || user.userInfo.notes) && (
              <div className="col-span-2">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={editedUser?.userInfo.address || ""}
                          onChange={(e) =>
                            setEditedUser((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    userInfo: {
                                      ...prev.userInfo,
                                      address: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={editedUser?.userInfo.notes || ""}
                          onChange={(e) =>
                            setEditedUser((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    userInfo: {
                                      ...prev.userInfo,
                                      notes: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {user.userInfo.address && (
                        <p>
                          <span className="text-muted-foreground">
                            Address:
                          </span>{" "}
                          {user.userInfo.address}
                        </p>
                      )}
                      {user.userInfo.notes && (
                        <p>
                          <span className="text-muted-foreground">Notes:</span>{" "}
                          {user.userInfo.notes}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="col-span-2">
              <h3 className="font-semibold mb-2">Recent Access Logs</h3>
              {isLoadingLogs ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Door</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : accessLogs.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Door</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.map((log) => (
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
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No recent access logs found
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
