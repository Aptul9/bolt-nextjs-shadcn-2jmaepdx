"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  Users,
  Key,
  LayoutDashboard,
  Settings,
  LogOut,
  Dumbbell,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onClose?: () => void;
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  onClose,
}: SidebarProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // State for logout confirmation dialog
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient(); // Create the Supabase client
    const { error } = await supabase.auth.signOut(); // Call signOut() to log the user out

    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    // Redirect to the login page after logout
    router.push("/login");
  };

  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      label: "Access Logs",
      icon: Key,
      href: "/dashboard/access-logs",
    },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background h-full transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <div className="flex h-[60px] items-center border-b px-6">
        <div className="flex items-center gap-2 overflow-hidden">
          <Dumbbell className="h-6 w-6 flex-shrink-0" />
          <span
            className={cn(
              "font-bold transition-all duration-300",
              isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            GymAccess
          </span>
        </div>
        {/* Close button for mobile */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-3 lg:hidden"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        )}
        {/* Collapse button for desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 h-6 w-6 rounded-full bg-background hidden lg:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1 pt-4">
        <div className="space-y-2 px-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={onClose}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-300",
                  isCollapsed ? "justify-center px-2" : "px-4"
                )}
              >
                <route.icon className="h-5 w-5 text-muted-foreground" />
                <span
                  className={cn(
                    "ml-3 transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}
                >
                  {route.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="space-y-2">
          {/* <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-300",
              isCollapsed ? "justify-center px-2" : "px-4"
            )}
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span
              className={cn(
                "ml-3 transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              Settings
            </span>
          </Button> */}
          <Button
            onClick={() => setIsLogoutDialogOpen(true)} // Open dialog on click
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300",
              isCollapsed ? "justify-center px-2" : "px-4"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span
              className={cn(
                "ml-3 transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogTitle>
            <VisuallyHidden>Confirm Logout</VisuallyHidden>
          </DialogTitle>
          <p className="text-lg font-medium">
            Are you sure you want to log out?
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
