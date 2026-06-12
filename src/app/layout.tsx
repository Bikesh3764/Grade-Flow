import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "CGPA Calculator & Academic Tracker | GradeFlow",
  description: "Calculate your CGPA, SGPA, and convert percentages to CGPA instantly. GradeFlow supports specific university grading systems including VIT, SRM, Anna University, KTU, VTU, IPU, and more.",
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
    url: "https://gradeflow.app",
    siteName: "GradeFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Calculator & Academic Tracker | GradeFlow",
    description: "The ultimate tool to calculate your CGPA, SGPA, and convert percentages to CGPA.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-37PPH531JQ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
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
        </ThemeProvider>
      </body>
    </html>
  );
}
