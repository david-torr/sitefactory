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
    <footer className="bg-[var(--color-footer-bg)] font-body text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-space-20">
        {/* Main footer content */}
        <div className="py-space-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" aria-label="Home">
                {resolvedLogo}
              </Link>
              {tagline && (
                <p className="mt-4 max-w-xs text-body-sm text-[var(--color-text-secondary)]">
                  {tagline}
                </p>
              )}
            </div>

            {/* Link groups */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-8 lg:grid-cols-3">
              {resolvedGroups.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-display text-caption uppercase tracking-widest text-[var(--color-text-secondary)]">
                    {group.heading}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-body-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-inverse)]"
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#FFFFFF1A] py-8 sm:flex-row">
          <div>
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              {copyrightText ?? `\u00A9 ${currentYear} ${copyrightName}. All rights reserved.`}
            </p>
            {acknowledgementOfCountry && (
              <p className="mt-2 text-body-sm text-[var(--color-text-secondary)]">{acknowledgementOfCountry}</p>
            )}
          </div>

          {resolvedLegal && resolvedLegal.length > 0 && (
            <nav aria-label="Legal links" className="flex items-center gap-6">
              {resolvedLegal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-inverse)]"
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
