"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NavLinks({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push(`/${id ? "#" + id : ""}`);
    } else if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <a
        href="#features"
        className="block py-2 px-4 rounded-md hover:bg-accent text-foreground transition-colors"
        onClick={(e) => handleClick(e, "features")}
      >
        Features
      </a>
      <a
        href="#pricing"
        className="block py-2 px-4 rounded-md hover:bg-accent text-foreground transition-colors"
        onClick={(e) => handleClick(e, "pricing")}
      >
        Pricing
      </a>
      <Link
        href="/contact"
        className="block py-2 px-4 rounded-md hover:bg-accent text-foreground transition-colors"
        onClick={() => onClose?.()}
      >
        Contact Us
      </Link>
      <Link
        href="/about"
        className="block py-2 px-4 rounded-md hover:bg-accent text-foreground transition-colors"
        onClick={() => onClose?.()}
      >
        About Us
      </Link>
      <Link href="/dashboard" onClick={() => onClose?.()}>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Dashboard
        </Button>
      </Link>
    </>
  );
}