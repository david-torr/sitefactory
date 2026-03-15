import Link from "next/link";

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
    <footer className="bg-neutral-900 font-body text-neutral-400">
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
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
                  {tagline}
                </p>
              )}
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
              {linkGroups.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-100">
                    {group.heading}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm transition-colors hover:text-white"
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 py-8 sm:flex-row">
          <p className="text-xs">
            &copy; {currentYear} {copyrightName}. All rights reserved.
          </p>

          {legalLinks && legalLinks.length > 0 && (
            <nav aria-label="Legal links" className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs transition-colors hover:text-white"
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
