"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
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
import {
  LayoutDashboard,
  Link2,
  LogOutIcon,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = useMemo(
    () => user?.email.charAt(0).toUpperCase() ?? "U",
    [user],
  );

  const publicLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#analytics", label: "Analytics" },
    { href: "/#security", label: "Security" },
  ];

  const closeMobile = () => setMobileOpen(false);
  const showMarketingLinks = !user && router.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={closeMobile}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
              <Link2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">
                Urlvy
              </span>
              <span className="block text-xs text-muted-foreground">
                Short links with live intelligence
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {showMarketingLinks
              ? publicLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))
              : null}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {!user ? (
              <div className="mr-2 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Production-grade redirects and analytics
              </div>
            ) : null}

            {user ? (
              <>
                <Button asChild variant="secondary" size="sm">
                  <Link
                    href="/app/links"
                    className="hover:translate-y-0 hover:bg-secondary/95 hover:shadow-xs"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Links
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer ring-1 ring-border">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    className="w-56"
                  >
                    <div className="border-b px-3 py-2">
                      <p className="text-sm font-medium">Signed in</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
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
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Log In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}

            <DarkModeToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <DarkModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="surface-panel mb-4 space-y-3 p-4 lg:hidden">
            {!user ? (
              <div className="space-y-2">
                {showMarketingLinks
                  ? publicLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                        onClick={closeMobile}
                      >
                        {item.label}
                      </Link>
                    ))
                  : null}
              </div>
            ) : (
              <div className="surface-muted px-4 py-3">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Manage your links and analytics workspace.
                </p>
              </div>
            )}

            <div className="grid gap-2">
              {user ? (
                <>
                  <Button
                    asChild
                    className="w-full justify-center"
                    variant="secondary"
                  >
                    <Link href="/app/links" onClick={closeMobile}>
                      <LayoutDashboard className="h-4 w-4" />
                      My Links
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-center"
                    variant="outline"
                    onClick={() => {
                      closeMobile();
                      logout();
                    }}
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="w-full justify-center"
                    variant="ghost"
                  >
                    <Link href="/auth/login" onClick={closeMobile}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link href="/auth/register" onClick={closeMobile}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
