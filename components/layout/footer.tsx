"use client";

import companyInfo from "@/constants/companyInfo";
import { getCurrentYear } from "@/lib/date-utils";

export function Footer() {
  return (
    <footer
      className="border-t bg-background/60 backdrop-blur-md"
      data-nosnippet
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {getCurrentYear()} PassCore. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground text-center sm:text-right">
            {/* <div>Contrada Castromurro 39, Belvedere Marittimo 87023</div> */}
            <div>{companyInfo.vatNumber}</div>
            <div> (+39) 351 834 7869</div>
          </div>
        </div>
      </div>
    </footer>
  );
}