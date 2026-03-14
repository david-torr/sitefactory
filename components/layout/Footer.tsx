import Link from "next/link";
import tokens from "@/tokens/tokens.json";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo: React.ReactNode;
  tagline?: string;
  linkGroups: FooterLinkGroup[];
  legalLinks?: FooterLink[];
  copyrightName: string;
}

export default function Footer({
  logo,
  tagline,
  linkGroups,
  legalLinks,
  copyrightName,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: tokens.color.neutral[900],
        fontFamily: tokens.typography.fontFamily.sans,
        color: tokens.color.neutral[400],
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" aria-label="Home">
                {logo}
              </Link>
              {tagline && (
                <p
                  style={{
                    fontSize: tokens.typography.fontSize.sm,
                    lineHeight: tokens.typography.lineHeight.relaxed,
                    color: tokens.color.neutral[400],
                  }}
                  className="mt-4 max-w-xs"
                >
                  {tagline}
                </p>
              )}
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
              {linkGroups.map((group) => (
                <div key={group.heading}>
                  <h3
                    style={{
                      fontSize: tokens.typography.fontSize.xs,
                      fontWeight: tokens.typography.fontWeight.semibold,
                      letterSpacing: tokens.typography.letterSpacing.widest,
                      color: tokens.color.neutral[100],
                      textTransform: "uppercase",
                    }}
                  >
                    {group.heading}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          style={{ fontSize: tokens.typography.fontSize.sm }}
                          className="transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTopColor: tokens.color.neutral[800] }}
          className="flex flex-col items-center justify-between gap-4 border-t py-8 sm:flex-row"
        >
          <p style={{ fontSize: tokens.typography.fontSize.xs }}>
            &copy; {currentYear} {copyrightName}. All rights reserved.
          </p>

          {legalLinks && legalLinks.length > 0 && (
            <nav aria-label="Legal links" className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: tokens.typography.fontSize.xs }}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
