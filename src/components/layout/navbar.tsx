"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Music2,
  BarChart2,
  History,
  PlayCircle,
  ListMusic,
  Sparkles,
  User,
  Radio,
} from "lucide-react";
import { useState, useCallback } from "react";

const navLinks = [
  {
    group: "Insights",
    items: [
      { href: "/top-tracks", label: "Top Tracks", icon: Music2 },
      { href: "/top-artists", label: "Top Artists", icon: User },
      { href: "/recently-played", label: "Recently Played", icon: History },
      { href: "/artist-analysis", label: "Artist Analysis", icon: BarChart2 },
    ],
  },
  {
    group: "Discover",
    items: [
      { href: "/playlist-generator", label: "Create Playlist", icon: PlayCircle },
      { href: "/playlist-sorter", label: "My Playlists", icon: ListMusic },
    ],
  },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setIsOpen(false);
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      await signIn("spotify");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  }, []);

  const NavItems = useCallback(
    () => (
      <>
        {navLinks.map((group) => (
          <div key={group.group} className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 hidden md:block">
              {group.group}
            </div>
            {group.items.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        ))}
      </>
    ),
    []
  );

  const UserAvatar = useCallback(
    () => (
      <Avatar>
        <AvatarImage src={session?.user?.image || ""} />
        <AvatarFallback>
          {session?.user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
    ),
    [session?.user?.image, session?.user?.name]
  );

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Prismy Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-violet-500 via-primary to-indigo-500 bg-clip-text text-transparent">Prismy</span>
        </Link>

        {status === "loading" ? (
          <div className="h-10 w-24 animate-pulse bg-muted rounded" />
        ) : status === "authenticated" ? (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((group) => (
                <div key={group.group} className="flex items-center space-x-4">
                  {group.items.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              ))}
              <HoverCard>
                <HoverCardTrigger>
                  <UserAvatar />
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-4">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center gap-3 mb-6">
                        <UserAvatar />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {session.user?.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {session.user?.email}
                          </span>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-6 mt-4">
                    <NavItems />
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        ) : (
          <Button onClick={handleSignIn}>Sign in with Spotify</Button>
        )}
      </div>
    </nav>
  );
}