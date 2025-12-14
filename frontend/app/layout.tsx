import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { QueryProvider } from "@/lib/React-Query-Wrapper";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Primary metadata
  title: "Pharmacy Management Software | Complete SaaS Solution for Pharmacies",
  description:
    "Powerful pharmacy management system with inventory tracking, prescription management, expiry monitoring, and sales analytics. Streamline your pharmacy operations with our cloud-based SaaS platform.",

  // Keywords (helps with indexing)
  keywords: [
    "pharmacy management software",
    "pharmacy inventory system",
    "prescription management",
    "pharmacy SaaS",
    "medication tracking",
    "pharmacy POS",
    "expiry date monitoring",
    "batch management system",
    "pharmacy billing software",
    "multi-tenant pharmacy software",
    "cloud pharmacy solution",
    "pharmacy stock management",
  ],

  // Author and creator
  authors: [{ name: "Your Company Name" }],
  creator: "Your Company Name",
  publisher: "Your Company Name",

  // Alternate languages (if applicable)
  alternates: {
    canonical: "https://pharmacy.bitaradigitalit.com",
    languages: {
      "en-US": "https://pharmacy.bitaradigitalit.com",
      "bn-BD": "https://pharmacy.bitaradigitalit.com/bn",
    },
  },

  // Open Graph (Facebook, LinkedIn sharing)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pharmacy.bitaradigitalit.com",
    siteName: "Your Pharmacy Management Platform",
    title: "Pharmacy Management Software | Complete SaaS Solution",
    description:
      "Streamline pharmacy operations with inventory tracking, prescription management, and real-time analytics. Trusted by pharmacies across Bangladesh.",
    images: [
      {
        url: "https://files.catbox.moe/9ke84l.jpeg",
        width: 1200,
        height: 630,
        alt: "Pharmacy Management Software Dashboard",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Pharmacy Management Software | Complete SaaS Solution",
    description:
      "Modern pharmacy management system with inventory, prescriptions, and analytics. Cloud-based and easy to use.",
    images: ["https://files.catbox.moe/9ke84l.jpeg"],
    creator: "@yourTwitterHandle",
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your codes)
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // App-specific
  category: "Healthcare Technology",
  applicationName: "Your Pharmacy Management Platform",

  // Manifest for PWA (if applicable)
  /*   manifest: "/manifest.json", */

  // Additional metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
