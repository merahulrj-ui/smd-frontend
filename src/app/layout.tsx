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
  metadataBase: new URL('https://smdmedicare.in'),
  title: {
    default: "Wholesale Medical Equipment Supplies Online - SMD MEDICARE",
    template: "%s | SMD MEDICARE",
  },
  description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
  keywords: ["medical equipment", "hospital furniture", "surgical instruments", "wholesale medical supplies", "diagnostic kits", "SMD Medicare"],
  authors: [{ name: "SMD Medicare" }],
  creator: "SMD Medicare",
  publisher: "SMD Medicare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Wholesale Medical Equipment Supplies Online - SMD MEDICARE",
    description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
    url: 'https://smdmedicare.in',
    siteName: 'SMD Medicare',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wholesale Medical Equipment Supplies Online - SMD MEDICARE",
    description: "Buy premium medical equipment, surgical instruments, hospital furniture & diagnostic test kits online in India at wholesale prices from SMD Medicare.",
  },
  icons: {
    icon: '/images/img_68ae826eb6cc47.12112340_logo.webp',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
