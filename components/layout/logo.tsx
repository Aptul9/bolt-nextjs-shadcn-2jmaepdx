"use client";

import { Dumbbell } from "lucide-react";
import Link from "next/link";

export function Logo({ href = "/" }) {
  return (
    <Link href={href} className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
      <Dumbbell className="h-8 w-8" />
      <span className="font-bold text-xl hidden sm:inline-block">GymAccess</span>
    </Link>
  );
}
