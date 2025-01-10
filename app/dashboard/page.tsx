"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [todayAccess, setTodayAccess] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch active users
        const activeResponse = await fetch(
          "/api/supabase/users/count?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080&activeOnly=true"
        );
        const activeData = await activeResponse.json();
        setActiveUsers(activeData.count);

        // Fetch total users
        const totalResponse = await fetch(
          "/api/supabase/users/count?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080"
        );
        const totalData = await totalResponse.json();
        setTotalUsers(totalData.count);

        // Fetch today's access count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayResponse = await fetch(
          `/api/supabase/access-logs?tenantId=de51a5d5-0648-484c-9a29-88b39c2b0080&startDate=${today.toISOString()}&countOnly=true`
        );
        const todayData = await todayResponse.json();
        setTodayAccess(todayData.count);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{activeUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access Today</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{todayAccess}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Access Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview />
        </CardContent>
      </Card>
    </div>
  );
}