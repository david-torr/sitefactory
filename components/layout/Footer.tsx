import Link from "next/link";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export interface PageBuilderColumn {
  title: string;
  links: { label: string; url: string }[];
}

export interface PageBuilderLegalLink {
  label: string;
  url: string;
}

export interface FooterProps {
  logo: React.ReactNode;
  tagline?: string;
  linkGroups: FooterLinkGroup[];
  legalLinks?: FooterLink[];
  copyrightName: string;
  /** Page-builder overrides */
  logoUrl?: string;
  copyrightText?: string;
  acknowledgementOfCountry?: string;
  navColumns?: PageBuilderColumn[];
  pbLegalLinks?: PageBuilderLegalLink[];
}

export default function Footer({
  logo,
  tagline,
  linkGroups,
  legalLinks,
  copyrightName,
  logoUrl,
  copyrightText,
  acknowledgementOfCountry,
  navColumns,
  pbLegalLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Resolve page-builder overrides
  const resolvedGroups: FooterLinkGroup[] = navColumns
    ? navColumns.map((col) => ({
        heading: col.title,
        links: col.links.map((l) => ({ label: l.label, href: l.url })),
      }))
    : linkGroups;

  const resolvedLegal: FooterLink[] | undefined = pbLegalLinks
    ? pbLegalLinks.map((l) => ({ label: l.label, href: l.url }))
    : legalLinks;

  const resolvedLogo = logoUrl ? (
    <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
  ) : (
    logo
  );

  return (
    <footer className="bg-neutral-900 font-body text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" aria-label="Home">
                {resolvedLogo}
              </Link>
              {tagline && (
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
                  {tagline}
                </p>
              )}
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
              {resolvedGroups.map((group) => (
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
          <div>
            <p className="text-xs">
              {copyrightText ?? `\u00A9 ${currentYear} ${copyrightName}. All rights reserved.`}
            </p>
            {acknowledgementOfCountry && (
              <p className="mt-2 text-xs text-neutral-500">{acknowledgementOfCountry}</p>
            )}
          </div>

          {resolvedLegal && resolvedLegal.length > 0 && (
            <nav aria-label="Legal links" className="flex items-center gap-6">
              {resolvedLegal.map((link) => (
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
