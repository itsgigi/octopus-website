import type { Metadata } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Octopus — Consumer electronics",
    template: "%s · Octopus",
  },
  description: "Kitchen appliances, home security, hair care and accessories designed by Octopus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
