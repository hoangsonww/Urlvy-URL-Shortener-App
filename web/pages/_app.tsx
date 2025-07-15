// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Outfit } from "next/font/google";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/Auth";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <main
        className={`${outfit.variable} flex min-h-screen flex-col font-sans`}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>

        <Toaster
          richColors
          position="bottom-right"
          // Also ensure each toast uses font-sans
          toastOptions={{
            className: "font-sans",
          }}
        />
      </main>
    </AuthProvider>
  );
}
