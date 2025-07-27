import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="utf-8" />
        <title>Urlvy — Smart Short Links & Live Insights</title>
        <meta
          name="description"
          content="Urlvy transforms long URLs into memorable slugs, adds AI‑powered summaries and tracks every click in real‑time. Share, analyse, and chat with an AI analyst about your traffic— all in one slick workspace."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Favicons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://urlvy.app" />
        <meta
          property="og:title"
          content="Urlvy — Smart Short Links & Live Insights"
        />
        <meta
          property="og:description"
          content="Urlvy transforms long URLs into memorable slugs, adds AI‑powered summaries and tracks every click in real‑time. Share, analyse, and chat with an AI analyst about your traffic."
        />
        <meta
          property="og:image"
          content="https://urlvy.app/android-chrome-512x512.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hoangsonww" />
        <meta
          name="twitter:title"
          content="Urlvy — Smart Short Links & Live Insights"
        />
        <meta
          name="twitter:description"
          content="Urlvy transforms long URLs into memorable slugs, adds AI‑powered summaries and tracks every click in real‑time."
        />
        <meta
          name="twitter:image"
          content="https://urlvy.app/android-chrome-512x512.png"
        />

        {/* sitemap hint */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>
      <body className="antialiased bg-white text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
