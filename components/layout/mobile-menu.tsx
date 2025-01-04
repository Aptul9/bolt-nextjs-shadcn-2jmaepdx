"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm sm:hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background/95">
        <span className="font-bold text-xl">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="p-4 flex flex-col space-y-6 bg-background/95">
        <NavLinks onClose={onClose} />
      </nav>
    </div>
  );
}