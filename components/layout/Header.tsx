"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo: React.ReactNode;
  navLinks: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  displayMode?: "solid" | "overlay";
  theme?: "dark" | "light";
  scrollBehaviour?: "no_change" | "become_solid" | "hide";
  scrolledBgColour?: string;
  scrolledTheme?: "dark" | "light";
  siteName?: string;
  logoUrl?: string;
}

export default function Header({
  logo,
  navLinks,
  ctaLabel,
  ctaHref,
  displayMode = "solid",
  theme = "light",
  scrollBehaviour = "become_solid",
  scrolledBgColour = "#ffffff",
  scrolledTheme = "light",
  siteName,
  logoUrl,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (scrollBehaviour === "no_change") return;

    function onScroll() {
      const y = window.scrollY;
      if (scrollBehaviour === "become_solid") {
        setIsScrolled(y > 80);
      } else if (scrollBehaviour === "hide") {
        setIsHidden(y > 80 && y > lastScrollY.current);
        setIsScrolled(y > 80);
      }
      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollBehaviour]);

  const isOverlay = displayMode === "overlay";
  const activeTheme = isScrolled ? scrolledTheme : theme;
  const isDark = activeTheme === "dark";

  const textClass = isDark ? "text-white" : "text-neutral-900";
  const linkClass = isDark
    ? "text-neutral-200 hover:text-white"
    : "text-neutral-600 hover:text-black";
  const hamburgerBg = isDark ? "bg-white" : "bg-neutral-900";

  const bgStyle: React.CSSProperties = {};
  let bgClass = "";

  if (isOverlay && !isScrolled) {
    bgClass = "bg-transparent";
  } else if (isOverlay && isScrolled) {
    bgStyle.backgroundColor = scrolledBgColour;
    bgStyle.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
  } else {
    bgClass = "bg-background border-b border-neutral-200";
  }

  const positionClass = isOverlay ? "fixed" : "sticky";

  const resolvedLogo = logoUrl ? (
    <img src={logoUrl} alt={siteName ?? "Logo"} className="h-8 w-auto" />
  ) : siteName ? (
    <span className={`font-body text-2xl font-bold tracking-tight ${textClass}`}>
      {siteName}
    </span>
  ) : (
    logo
  );

  return (
    <header
      className={`top-0 z-50 w-full font-body transition-all duration-300 ${positionClass} ${bgClass} ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
      style={bgStyle}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link href="/" aria-label="Home">
            {resolvedLogo}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${linkClass}`}
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
              className={`hidden rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80 md:inline-flex ${
                isDark
                  ? "bg-white text-neutral-900"
                  : "bg-accent text-white"
              }`}
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
              className={`block h-0.5 w-6 transition-transform duration-200 ${hamburgerBg} ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 transition-opacity duration-200 ${hamburgerBg} ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 transition-transform duration-200 ${hamburgerBg} ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <ul className="flex flex-col px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-base font-medium text-neutral-700 transition-colors hover:text-black"
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
                  className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
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
