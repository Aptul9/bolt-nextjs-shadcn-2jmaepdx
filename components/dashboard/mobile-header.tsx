"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="absolute left-1/2 -translate-x-1/2">
        <Logo href="/dashboard"/>
      </div>
    </header>
  );
}