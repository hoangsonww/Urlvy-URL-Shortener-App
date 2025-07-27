import Head from "next/head";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found</title>
        <meta
          name="description"
          content="The page you are looking for could not be found."
        />
      </Head>

      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <Card className="max-w-md p-8">
          <CardContent className="space-y-6">
            <AlertOctagon className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="text-4xl font-extrabold">404</h1>
            <p className="text-lg text-muted-foreground">
              Oops — we can’t find that page.
            </p>
            <div className="space-x-3">
              <Link href="/" passHref>
                <Button size="lg">Go to Home</Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
