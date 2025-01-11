"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserDetails } from "@/components/dashboard/user/user-details";
import { UserAccessLogs } from "@/components/dashboard/user/user-access-logs";
import { UserSubscriptionInfo } from "@/components/dashboard/user/user-subscription-info";
import { UserContactInfo } from "@/components/dashboard/user/user-contact-info";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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
      <h1 className="text-3xl font-bold">{user.name}</h1>
      
      <div className="grid grid-cols-2 gap-8">
        <UserSubscriptionInfo user={user} />
        <UserContactInfo user={user} />
        <UserDetails user={user} />
        <UserAccessLogs userId={user.id} />
      </div>
    </div>
  );
}