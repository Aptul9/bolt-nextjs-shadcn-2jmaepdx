"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      {/* Sidebar - hidden on mobile by default, shown when menu is opened */}
      <div className={`
        fixed inset-0 z-50 lg:relative
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        lg:block
      `}>
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative h-full">
          <Sidebar 
            isCollapsed={isCollapsed} 
            setIsCollapsed={setIsCollapsed}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-0 lg:pt-8 px-4 lg:px-8 pb-8">
        {children}
      </main>
    </div>
  );
}