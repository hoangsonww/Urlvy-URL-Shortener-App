import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, BarChart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function LinkCard({ link }: { link: any }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = `https://urlvy-url-shortener-app.onrender.com/urls/${link.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Title container takes full width */}
        <div className="w-full sm:max-w-[70%]">
          <CardTitle className="w-full text-base font-medium break-words overflow-hidden">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
            >
              <span className="truncate">{link.slug}</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </CardTitle>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {copied ? "Copied!" : "Copy URL"}
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      <CardContent className="space-y-2">
        {link.summary ? (
          <p className="text-sm text-muted-foreground">{link.summary}</p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            Summary pending…
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Badge variant="secondary">{link.clicks.length} clicks</Badge>
        <Link
          href={`/app/links/${link.slug}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <BarChart className="h-3 w-3" /> Details
        </Link>
      </CardFooter>
    </Card>
  );
}
