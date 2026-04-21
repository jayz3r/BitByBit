import type { Metadata } from "next";
import Script from "next/script";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "BitByBit - Learn Anything, Bit by Bit",
  description: "Master any skill with interactive lessons and AI-powered guidance",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1e293b" />
        
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="prefetch" href="/data/courses.json" />

        {/* MathJax Configuration */}
        <Script
          id="mathjax-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                },
                svg: {
                  fontCache: 'global',
                  scale: 1,
                },
                startup: {
                  pageReady: () => {
                    return Promise.resolve();
                  },
                },
              };
            `,
          }}
        />

        {/* MathJax Library */}
        <Script
          id="mathjax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="lazyOnload"
          async
        />
      </head>

      <body className="bg-slate-900" suppressHydrationWarning>
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}