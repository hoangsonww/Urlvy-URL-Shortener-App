import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Outfit } from "next/font/google";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/Auth";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import MetaUpdater from "@/components/MetaUpdater";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* handles initial + live updates of <meta name="theme-color"> */}
      <MetaUpdater />

      <AuthProvider>
        <main
          className={`${outfit.variable} flex min-h-screen flex-col font-sans`}
        >
          <Analytics />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{ className: "font-sans" }}
          />
        </main>
      </AuthProvider>
    </>
  );
}
