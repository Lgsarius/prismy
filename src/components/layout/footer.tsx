"use client";

import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 max-w-7xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            © {new Date().getFullYear()} Prismy. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/impressum" className="text-sm text-muted-foreground hover:text-foreground">
            Impressum
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <a
            href="https://github.com/yourusername/prismy"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground/80 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
} 