"use client";

import Link from "next/link";
import { useAuth } from "@/context/Auth";
import DarkModeToggle from "./DarkToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOutIcon, Link2 } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center text-2xl font-extrabold tracking-tight hover:opacity-80"
        >
          <Link2 className="h-6 w-6 mr-2" />
          Urlvy
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/app/links">
                <Button variant="secondary" size="sm">
                  My Links
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border">
                    <AvatarFallback>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-36">
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <LogOutIcon className="h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}

          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
