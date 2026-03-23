"use client";

import Header from "./layout/Header";
import HeroHeader from "./sections/HeroHeader";
import ContentBlock from "./sections/ContentBlock";
import ObjectBlock from "./sections/ObjectBlock";
import Footer from "./layout/Footer";
import type { PageSection, HeroItemType, LinkBarItemType } from "../types/page-builder";
import type { HeroSlide, LinkBarItem } from "./sections/HeroHeader";

// ─── Adapters: page-builder types → existing component props ─────────────────

function mapHeroItems(items: HeroItemType[]): HeroSlide[] {
  return items.map((item, i) => ({
    name: `slide-${i}`,
    title: item.title,
    subtitle: item.description,
    theme: item.theme,
    bgColour: item.theme === "dark" ? "#171717" : "#fafafa",
    bgImage: item.background_image ? { url: item.background_image.url } : undefined,
    button1Label: item.cta_primary?.label,
    button1Link: item.cta_primary
      ? { label: item.cta_primary.label, url: item.cta_primary.url }
      : undefined,
    button2Label: item.cta_secondary?.label,
    button2Link: item.cta_secondary
      ? { label: item.cta_secondary.label, url: item.cta_secondary.url }
      : undefined,
  }));
}

function mapLinkBarItems(items: LinkBarItemType[]): LinkBarItem[] {
  return items.map((item) => ({
    icon: item.icon ? { url: item.icon.url } : undefined,
    title: item.label,
    subtitle: item.subtitle,
    link: item.link ? { label: item.link.label, url: item.link.url } : undefined,
  }));
}

// Centre → center mapping for existing components
function normalizeAlign(a?: string): "left" | "center" | "right" {
  if (a === "centre") return "center";
  return (a as "left" | "center" | "right") ?? "left";
}

// ─── Fallback logo ───────────────────────────────────────────────────────────

const FallbackLogo = (
  <span className="font-body text-2xl font-bold tracking-tight">Forma</span>
);

const FooterFallbackLogo = (
  <span className="font-body text-2xl font-bold tracking-tight text-neutral-100">Forma</span>
);

// ─── PageBuilder ─────────────────────────────────────────────────────────────

export default function PageBuilder({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.__component) {
          case "sections.site-nav":
            return (
              <Header
                key={i}
                logo={FallbackLogo}
                displayMode={section.display_mode}
                theme={section.theme}
                scrollBehaviour={section.scroll_behaviour}
                scrolledBgColour={section.scrolled_bg_colour}
                scrolledTheme={section.scrolled_theme}
                siteName={section.site_name}
                logoUrl={section.logo_default?.url}
                ctaLabel={section.cta_label}
                ctaHref={section.cta_link?.url}
                navLinks={section.nav_items.map((n) => ({
                  label: n.label,
                  href: n.url,
                }))}
              />
            );
          case "sections.hero-header":
            return (
              <HeroHeader
                key={i}
                name={section.name}
                heroItems={mapHeroItems(section.items)}
                contentAlignment={normalizeAlign(section.content_alignment)}
                verticalAlignment={section.vertical_alignment}
                carouselSpeedMode={section.carousel_speed}
                linkBarVisible={section.link_bar}
                linkBarBgColour={section.link_bar_bg}
                linkBarItems={mapLinkBarItems(section.link_bar_items)}
              />
            );
          case "sections.content-block":
            return (
              <ContentBlock
                key={i}
                name={section.name}
                title={section.title}
                subtitle={section.subtitle}
                titleAlignment={normalizeAlign(section.title_alignment)}
                backgroundColour={section.bg_colour}
                theme={section.theme}
                style={section.style}
                mediaAlignment={section.media_alignment}
                columns={parseInt(section.columns)}
                layout={section.layout}
                articles={section.articles}
                link={section.link ? { label: section.link.label, url: section.link.url } : undefined}
              />
            );
          case "sections.object-block":
            return (
              <ObjectBlock
                key={i}
                name={section.name}
                title={section.title}
                subtitle={section.subtitle}
                titleAlignment={normalizeAlign(section.title_alignment)}
                backgroundColour={section.bg_colour}
                theme={section.theme}
                columns={parseInt(section.columns)}
                layout={section.layout as any}
                articles={section.articles}
                link={section.link ? { label: section.link.label, url: section.link.url } : undefined}
              />
            );
          case "sections.footer-block":
            return (
              <Footer
                key={i}
                logo={FooterFallbackLogo}
                linkGroups={[]}
                copyrightName=""
                logoUrl={section.logo?.url}
                copyrightText={section.copyright_text}
                acknowledgementOfCountry={section.acknowledgement_of_country}
                navColumns={section.nav_columns}
                pbLegalLinks={section.legal_links}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
