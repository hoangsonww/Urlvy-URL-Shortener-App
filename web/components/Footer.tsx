import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Github,
  Linkedin,
  Link2,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const productLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#analytics", label: "Analytics" },
    { href: "/#security", label: "Security" },
  ];
  const accountLinks = [
    { href: "/auth/login", label: "Log In" },
    { href: "/auth/register", label: "Create Account" },
    { href: "/app/links", label: "Dashboard" },
  ];
  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <footer className="mt-auto border-t border-border/70 bg-background/65 backdrop-blur-md">
      <div className="page-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-primary">
                <Link2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">Urlvy</p>
                <p className="text-sm text-muted-foreground">
                  Smart short links with analytics, summaries, and live routing
                  insight.
                </p>
              </div>
            </div>

            <div className="surface-muted flex items-center gap-3 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Built for modern teams that need reliable redirects and readable
                campaign intelligence.
              </p>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <Link
                href="https://github.com/sonnguyenhoang"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border/70 p-2 hover:border-primary/35 hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/in/sonnguyenhoang"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border/70 p-2 hover:border-primary/35 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Product</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {productLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">Workspace</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="mb-3 text-sm font-semibold">Legal</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="surface-muted flex items-start gap-3 px-4 py-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Product-specific legal pages covering redirects, analytics, AI
                summaries, and local browser storage.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Crafted by{" "}
            <Link
              href="https://sonnguyenhoang.com"
              className="font-medium text-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Son Nguyen
            </Link>{" "}
            in {year}.
          </p>
          <p>
            <Link
              href="https://github.com/hoangsonww/Urlvy-URL-Shortener-App"
              className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
