"use client";

import Link from "next/link";
import { useState } from "react";
import tokens from "@/tokens/tokens.json";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo: React.ReactNode;
  navLinks: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
}

export default function Header({ logo, navLinks, ctaLabel, ctaHref }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: tokens.color.brand.secondary,
        fontFamily: tokens.typography.fontFamily.sans,
        borderBottomColor: tokens.color.neutral[200],
      }}
      className="sticky top-0 z-50 w-full border-b"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link href="/" aria-label="Home">
            {logo}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: tokens.color.neutral[600],
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.medium,
                letterSpacing: tokens.typography.letterSpacing.wide,
              }}
              className="transition-colors hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              style={{
                backgroundColor: tokens.color.brand.primary,
                color: tokens.color.brand.secondary,
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.semibold,
                borderRadius: tokens.borderRadius.md,
              }}
              className="hidden px-4 py-2 transition-opacity hover:opacity-80 md:inline-flex"
            >
              {ctaLabel}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col justify-center gap-1.5 p-1 md:hidden"
          >
            <span
              style={{ backgroundColor: tokens.color.brand.primary }}
              className={`block h-0.5 w-6 transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              style={{ backgroundColor: tokens.color.brand.primary }}
              className={`block h-0.5 w-6 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              style={{ backgroundColor: tokens.color.brand.primary }}
              className={`block h-0.5 w-6 transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          style={{ borderTopColor: tokens.color.neutral[200] }}
          className="border-t md:hidden"
        >
          <ul className="flex flex-col px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: tokens.color.neutral[700],
                    fontSize: tokens.typography.fontSize.base,
                    fontWeight: tokens.typography.fontWeight.medium,
                  }}
                  className="block py-3 transition-colors hover:text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {ctaLabel && ctaHref && (
              <li className="mt-3">
                <Link
                  href={ctaHref}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    backgroundColor: tokens.color.brand.primary,
                    color: tokens.color.brand.secondary,
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    borderRadius: tokens.borderRadius.md,
                  }}
                  className="inline-flex px-4 py-2 transition-opacity hover:opacity-80"
                >
                  {ctaLabel}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
