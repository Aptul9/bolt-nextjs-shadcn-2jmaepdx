"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserDetails } from "@/components/dashboard/user/user-details";
import { UserAccessLogs } from "@/components/dashboard/user/user-access-logs";
import { UserSubscriptionInfo } from "@/components/dashboard/user/user-subscription-info";
import { UserContactInfo } from "@/components/dashboard/user/user-contact-info";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/supabase/users/${id}`, {
          headers: {
            "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Reset to original user data
  };

  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      // Update user data
      const userResponse = await fetch(`/api/supabase/users/${editedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
        },
        body: JSON.stringify({
          name: editedUser.name,
          subscriptionType: editedUser.subscriptionType,
          status: editedUser.status,
          expiresAt: editedUser.expiresAt,
          remainingSlots: editedUser.remainingSlots,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      // Update user info
      const userInfoResponse = await fetch(
        `/api/supabase/user-info/${editedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
          },
          body: JSON.stringify({
            email: editedUser.userInfo.email,
            phoneNumber: editedUser.userInfo.phoneNumber,
            address: editedUser.userInfo.address,
            birthDate: editedUser.userInfo.birthDate,
            birthPlace: editedUser.userInfo.birthPlace,
            nationality: editedUser.userInfo.nationality,
            gender: editedUser.userInfo.gender,
            emergencyContact: editedUser.userInfo.emergencyContact,
            notes: editedUser.userInfo.notes,
          }),
        }
      );

      if (!userInfoResponse.ok) {
        const errorData = await userInfoResponse.json();
        throw new Error(errorData.message || "Failed to update user info");
      }

      // Fetch updated user data to ensure we have the latest state
      const updatedUserResponse = await fetch(`/api/supabase/users/${editedUser.id}`, {
        headers: {
          "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
        },
      });

      if (!updatedUserResponse.ok) {
        throw new Error("Failed to fetch updated user data");
      }

      const updatedUser = await updatedUserResponse.json();
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setIsEditing(false);
      toast.success("User information updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update user information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserChange = (field: string, value: any) => {
    setEditedUser((prev) => {
      if (!prev) return null;

      // Handle nested fields (e.g., "userInfo.email")
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof User],
            [child]: value,
          },
        };
      }

      // Handle top-level fields
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        {!isEditing ? (
          <Button onClick={handleEdit}>Edit</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <UserSubscriptionInfo
          user={user}
          isEditing={isEditing}
          editedUser={editedUser}
          onUserChange={handleUserChange}
        />
        <UserContactInfo
          user={user}
          isEditing={isEditing}
          editedUser={editedUser}
          onUserChange={handleUserChange}
        />
        <UserDetails
          user={user}
          isEditing={isEditing}
          editedUser={editedUser}
          onUserChange={handleUserChange}
        />
        <UserAccessLogs userId={user.id} />
      </div>
    </div>
  );
}