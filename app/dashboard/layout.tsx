"use client";
import { useState, useRef } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      {/* Overlay with fade animation */}
      <div 
        className={`
          fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden
          transition-opacity duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleOverlayClick}
      />

      {/* Sidebar Container with slide animation */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 lg:relative
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
      >
        <div ref={sidebarRef} className="relative h-full">
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