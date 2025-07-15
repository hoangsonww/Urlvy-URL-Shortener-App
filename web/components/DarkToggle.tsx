"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Monitor, Sun, Moon } from "lucide-react";

type Theme = "system" | "light" | "dark";
const THEME_KEY = "urlvy_theme";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // Apply theme setting to <html>
  const apply = (th: Theme) => {
    const root = document.documentElement;
    root.classList.remove("dark");
    if (th === "dark") root.classList.add("dark");
    else if (
      th === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      root.classList.add("dark");
    }
  };

  // Load on mount
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as Theme) || "system";
    setTheme(saved);
    apply(saved);

    if (saved === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => apply("system");
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    }
  }, []);

  const select = (th: Theme) => {
    setTheme(th);
    localStorage.setItem(THEME_KEY, th);
    apply(th);
  };

  const icon =
    theme === "light" ? (
      <Sun className="h-5 w-5" />
    ) : theme === "dark" ? (
      <Moon className="h-5 w-5" />
    ) : (
      <Monitor className="h-5 w-5" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => select("system")}
          className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 ${
            theme === "system"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Monitor
            className={`h-4 w-4 ${theme === "system" ? "text-primary-foreground" : ""}`}
          />
          System
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => select("light")}
          className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 ${
            theme === "light"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Sun
            className={`h-4 w-4 ${theme === "light" ? "text-primary-foreground" : ""}`}
          />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => select("dark")}
          className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 ${
            theme === "dark"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Moon
            className={`h-4 w-4 ${theme === "dark" ? "text-primary-foreground" : ""}`}
          />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
