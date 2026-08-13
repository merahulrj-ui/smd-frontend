import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

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
  description: "SMD Medicare is a trusted wholesale supplier of premium medical equipment, surgical instruments, hospital furniture, and diagnostic kits in India.",
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
    description: "Trusted wholesale supplier of premium medical equipment, surgical instruments, hospital furniture, and diagnostic kits.",
    url: 'https://smdmedicare.in',
    siteName: 'SMD Medicare',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wholesale Medical Equipment Supplies Online - SMD MEDICARE",
    description: "Trusted wholesale supplier of premium medical equipment, surgical instruments, hospital furniture, and diagnostic kits.",
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
        {children}
      </body>
    </html>
  );
}
