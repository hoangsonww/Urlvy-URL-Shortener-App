import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Copy,
  ExternalLink,
  Globe2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatDate, getHostname, getShortUrl } from "@/lib/link-utils";

export default function LinkCard({ link }: { link: any }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = getShortUrl(link.slug);
  const clicks = Array.isArray(link?.clicks) ? link.clicks : [];
  const host = getHostname(link.destination);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="group border-border/70 bg-card/92 py-0">
      <CardHeader className="gap-4 border-b border-border/70 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Globe2 className="h-3.5 w-3.5" />
              {host}
            </Badge>
            <CardTitle className="text-lg font-semibold tracking-tight">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 break-all hover:text-primary"
              >
                {link.slug}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </CardTitle>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Created {formatDate(link.createdAt)}
            </p>
          </div>

          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="surface-muted overflow-hidden px-4 py-3">
          <p className="break-all text-sm font-medium text-foreground">
            {shortUrl}
          </p>
          <p className="mt-1 break-all text-xs leading-5 text-muted-foreground">
            Redirects to {link.destination}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {link.summary ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {link.summary}
          </p>
        ) : (
          <p className="text-sm italic leading-6 text-muted-foreground">
            AI summary pending. Urlvy will enrich this link as metadata becomes
            available.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="surface-muted px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Clicks
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {clicks.length}
            </p>
          </div>
          <div className="surface-muted px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {link.summary ? "Ready" : "Processing"}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t border-border/70 pt-5">
        <span className="text-xs text-muted-foreground">
          {copied
            ? "Copied to clipboard"
            : "Share, track, and inspect detailed performance"}
        </span>
        <Link
          href={`/app/links/${link.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
        >
          <BarChart3 className="h-4 w-4" />
          View details
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
