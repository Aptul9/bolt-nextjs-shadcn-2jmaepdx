"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./nav-links";
import { useEffect, useRef } from "react";
import { MobileMenuProps } from "@/types/types";


export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Instead of returning null, we'll keep the component mounted but invisible
  return (
    <div 
      className={`
        fixed inset-0 z-50 sm:hidden
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />
      
      {/* Menu content with slide animation */}
      <div 
        ref={menuRef} 
        className={`
          relative h-full
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
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
    </div>
  );
}