"use client";

import { getCurrentYear } from "@/lib/date-utils";

export function Footer() {
  return (
    <footer className="border-t bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {getCurrentYear()} GymAccess. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground text-center sm:text-right">
            <div>123 Fitness Street, GymCity 12345</div>
            <div>VAT: GB123456789</div>
            <div>+1 (555) 123-4567</div>
          </div>
        </div>
      </div>
    </footer>
  );
}