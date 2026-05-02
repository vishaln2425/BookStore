import type { Metadata } from "next";
import { Playfair_Display, Libre_Baskerville, EB_Garamond, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { PageTransition } from "../components/ui/PageTransition";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const libre = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-libre",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
});

export const metadata: Metadata = {
  title: "Swipe Books | Editorial Edition",
  description: "The World's Premier Digital Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${libre.variable} ${garamond.variable} ${cormorant.variable} ${dmsans.variable} font-garamond antialiased bg-ivory text-ink min-h-screen selection:bg-gold-light selection:text-ink`}>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
