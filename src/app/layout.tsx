import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col bg-[var(--cg-bg)] text-[var(--cg-text)]">
        {children}
      </body>
    </html>
  );
}
