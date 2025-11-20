import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Luckiest_Guy } from "next/font/google"; // Fonte estilo Fortnite
import "./globals.css";
import Navbar from "./components/Navbar"; // Quando criarmos a navbar

// Fonte Fortnite (Google Font)
const fortniteFont = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fortnite",
});

// Fontes padrão
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadados do projeto
export const metadata: Metadata = {
  title: "Fortnite Store",
  description: "Loja Fortnite - Projeto Técnico",
};

// Layout Global
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`
          ${fortniteFont.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          bg-black text-white antialiased min-h-screen
        `}
      >
        <Navbar />
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}
