"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#111] border-b border-purple-600 shadow-lg px-8 py-4 flex items-center justify-between">
      
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <h1
          className="text-4xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,255,0,0.7)]"
          style={{ fontFamily: "var(--font-fortnite)" }}
        >
          FORTNITE STORE
        </h1>
      </Link>

      {/* LINKS */}
      <div className="flex gap-8 text-lg font-semibold">
        <NavbarLink href="/">Home</NavbarLink>
        <NavbarLink href="/shop">Loja</NavbarLink>
        <NavbarLink href="/inventory">Inventário</NavbarLink>
        <NavbarLink href="/login">Login</NavbarLink>
      </div>

      {/* CARRINHO */}
      <Link href="/cart">
        <Image
          src="/cart.png" // coloque o arquivo cart.png em /public
          width={34}
          height={34}
          alt="Carrinho"
          className="hover:scale-110 transition-transform drop-shadow-[0_0_4px_rgba(255,255,0,0.8)]"
        />
      </Link>
    </nav>
  );
}

// Componente de link com animação Fortnite
function NavbarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        relative text-white uppercase tracking-wide 
        hover:text-yellow-300 transition font-bold
        before:absolute before:bottom-0 before:left-0 
        before:w-0 before:h-[3px] before:bg-yellow-400 
        before:transition-all before:duration-300 
        hover:before:w-full
      "
      style={{ fontFamily: "var(--font-fortnite)" }}
    >
      {children}
    </Link>
  );
}
