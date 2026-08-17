import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import FontAwesomeLoader from "@/components/FontAwesomeLoader";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.smdmedicare.in'),
  applicationName: 'SMD MEDICARE',
  title: {
    default: "SMD MEDICARE - Wholesale Medical Equipment Supplies Online",
    template: "%s | SMD MEDICARE",
  },
  description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
  keywords: ["SMD MEDICARE", "SMD Medicare", "medical equipment", "hospital furniture", "surgical instruments", "wholesale medical supplies", "diagnostic kits"],
  authors: [{ name: "SMD MEDICARE" }],
  creator: "SMD MEDICARE",
  publisher: "SMD MEDICARE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SMD MEDICARE - Wholesale Medical Equipment Supplies Online",
    description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
    url: 'https://www.smdmedicare.in',
    siteName: 'SMD MEDICARE',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.smdmedicare.in/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SMD MEDICARE Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smd_medicare',
    creator: '@smd_medicare',
    title: "SMD MEDICARE - Wholesale Medical Equipment Supplies Online",
    description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
    images: ['https://www.smdmedicare.in/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SMD MEDICARE",
  "alternateName": [
    "SMD Medicare", 
    "SMD MEDICARE INDIA", 
    "smdmedicare", 
    "smdmedicare.in", 
    "www.smdmedicare.in"
  ],
  "url": "https://www.smdmedicare.in/"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${manrope.className} antialiased overflow-x-hidden`}>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P4S7S7G36W"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P4S7S7G36W', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <FontAwesomeLoader />
        {children}
      </body>
    </html>
  );
}
