import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHESSGOD — Can Humanity Defeat God?",
  description:
    "Challenge the ultimate chess intelligence. ChessGod predicts your moves, exploits your mistakes, and calculates your defeat. 2,184,331 humans have challenged. Only 17 have won.",
  keywords: [
    "chess",
    "AI chess",
    "chess engine",
    "Stockfish",
    "chess game",
    "chess AI",
    "ChessGod",
  ],
  openGraph: {
    title: "CHESSGOD — Can Humanity Defeat God?",
    description:
      "Challenge the ultimate chess intelligence. Only 17 humans have ever won.",
    type: "website",
    images: ["/chessgod.png"],
  },
  icons: {
    icon: "/chessgod.png",
    apple: "/chessgod.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/chessgod.png" sizes="any" />
        <meta name="theme-color" content="#050508" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--cg-bg)] text-[var(--cg-text)]">
        {children}
      </body>
    </html>
  );
}
