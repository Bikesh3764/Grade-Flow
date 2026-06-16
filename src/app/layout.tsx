import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ServiceWorkerRegistration } from "@/components/ui/ServiceWorkerRegistration";
import { GlobalStructuredData } from "@/components/seo/GlobalStructuredData";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL('https://cgpacalculator.xyz'),
  title: "CGPA Calculator & Academic Tracker | GradeFlow",
  description: "Calculate your CGPA, SGPA, and convert percentages to CGPA instantly. GradeFlow supports specific university grading systems including VIT, SRM, Anna University, KTU, VTU, IPU, and more.",
  alternates: {
    canonical: 'https://cgpacalculator.xyz',
  },
  keywords: [
    "cgpa calculator", "percentage to cgpa calculator", "vit cgpa calculator", "srm cgpa calculator", 
    "sgpa to cgpa calculator", "cgpa calculator vit", "ktu cgpa calculator", "cgpa calculator vtu",
    "cgpa calculator srm", "cgpa calculator ktu", "vtu cgpa calculator", "ipu cgpa calculator",
    "marks to cgpa calculator", "saveetha cgpa calculator", "cgpa calculator anna university",
    "gpa to cgpa calculator", "anna university cgpa calculator", "cgpa calculator ipu",
    "kl cgpa calculator", "cgpa calculator to percentage"
  ],
  openGraph: {
    title: "CGPA Calculator & Academic Tracker | GradeFlow",
    description: "Calculate your CGPA, convert percentage to CGPA, or compute marks to CGPA instantly for VIT, SRM, Anna University, and 1000+ others.",
    url: "https://cgpacalculator.xyz",
    siteName: "GradeFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Calculator & Academic Tracker | GradeFlow",
    description: "The ultimate tool to calculate your CGPA, SGPA, and convert percentages to CGPA.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-37PPH531JQ"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-37PPH531JQ');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans bg-background text-on-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ServiceWorkerRegistration />
          <GlobalStructuredData />
        </ThemeProvider>
      </body>
    </html>
  );
}
