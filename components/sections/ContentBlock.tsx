"use client";

import { useState, useEffect, useCallback } from "react";
import tokens from "@/tokens/tokens.json";
import type { StrapiMedia, StrapiLink, StrapiVideo } from "./types";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ContentItem {
  name: string;
  title?: string;
  blurb?: string;
  image?: StrapiMedia;
  bgColour?: string;
  alignment?: "left" | "center" | "right";
  themeOverride?: "light" | "dark";
  primaryLink?: StrapiLink;
  secondaryLink?: StrapiLink;
  video?: StrapiVideo;
}

export interface ContentBlockProps {
  name: string;
  title?: string;
  subtitle?: string;
  titleAlignment?: "left" | "center" | "right";
  backgroundColour?: string;
  backgroundImage?: StrapiMedia;
  theme?: "light" | "dark";
  style?: "card" | "list" | "carousel" | "masonry";
  columns?: number;
  layout?: "grid" | "alternating" | "featured";
  carouselInterval?: number;
  link?: StrapiLink;
  items?: ContentItem[];
}

// ─── Column grid class map ────────────────────────────────────────────────────
// Static strings so Tailwind includes them in the bundle.

const gridColsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

const textAlignClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const maxWidthAlignClass: Record<string, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ContentBlockSkeleton() {
  return (
    <div
      className="w-full animate-pulse px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundColor: tokens.color.neutral[100] }}
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-8 w-1/3 rounded-md" style={{ backgroundColor: tokens.color.neutral[300] }} />
          <div className="h-4 w-1/2 rounded" style={{ backgroundColor: tokens.color.neutral[200] }} />
        </div>

        {/* Card skeletons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg"
              style={{ backgroundColor: tokens.color.neutral[200] }}
            >
              <div className="h-48 w-full" style={{ backgroundColor: tokens.color.neutral[300] }} />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded" style={{ backgroundColor: tokens.color.neutral[300] }} />
                <div className="h-4 w-full rounded" style={{ backgroundColor: tokens.color.neutral[300] }} />
                <div className="h-4 w-5/6 rounded" style={{ backgroundColor: tokens.color.neutral[300] }} />
                <div className="h-9 w-28 rounded-md pt-1" style={{ backgroundColor: tokens.color.neutral[300] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Link button helper ───────────────────────────────────────────────────────

interface LinkButtonProps {
  link: StrapiLink;
  variant: "primary" | "secondary";
  isDark: boolean;
}

function LinkButton({ link, variant, isDark }: LinkButtonProps) {
  if (!link.label || !link.url) return null;

  const primaryStyle: React.CSSProperties =
    variant === "primary"
      ? {
          backgroundColor: tokens.color.brand.primary,
          color: tokens.color.brand.secondary,
          fontWeight: tokens.typography.fontWeight.semibold,
          fontSize: tokens.typography.fontSize.sm,
          borderRadius: tokens.borderRadius.md,
          letterSpacing: tokens.typography.letterSpacing.wide,
        }
      : {
          border: `1.5px solid ${isDark ? tokens.color.neutral[500] : tokens.color.neutral[300]}`,
          color: isDark ? tokens.color.neutral[200] : tokens.color.neutral[700],
          fontWeight: tokens.typography.fontWeight.medium,
          fontSize: tokens.typography.fontSize.sm,
          borderRadius: tokens.borderRadius.md,
        };

  return (
    <a
      href={link.url}
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      style={primaryStyle}
      className="inline-flex items-center px-5 py-2.5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {link.label}
    </a>
  );
}

// ─── Content item card ────────────────────────────────────────────────────────

interface ContentItemCardProps {
  item: ContentItem;
  blockTheme: "light" | "dark";
  compact?: boolean;
}

function ContentItemCard({ item, blockTheme, compact = false }: ContentItemCardProps) {
  const isDark = (item.themeOverride ?? blockTheme) === "dark";
  const textPrimary = isDark ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary = isDark ? tokens.color.neutral[400] : tokens.color.neutral[600];
  const cardBg = item.bgColour ?? (isDark ? tokens.color.neutral[800] : tokens.color.brand.secondary);
  const alignment = item.alignment ?? "left";
  const videoSrc = item.video?.file?.url ?? item.video?.url;
  const hasMedia = !!(item.image?.url || videoSrc);

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-lg"
      style={{
        backgroundColor: cardBg,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      {/* Media */}
      {hasMedia && (
        <div className={`w-full overflow-hidden ${compact ? "h-36" : "h-52"} shrink-0`}>
          {videoSrc ? (
            <video
              src={videoSrc}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            <img
              src={item.image!.url}
              alt={item.image!.alternativeText ?? item.title ?? ""}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* Body */}
      <div
        className={`flex flex-1 flex-col gap-3 p-5 ${textAlignClass[alignment]}`}
      >
        {item.title && (
          <h3
            style={{
              color: textPrimary,
              fontSize: tokens.typography.fontSize.lg,
              fontWeight: tokens.typography.fontWeight.semibold,
              lineHeight: tokens.typography.lineHeight.snug,
            }}
          >
            {item.title}
          </h3>
        )}

        {item.blurb && (
          <p
            style={{
              color: textSecondary,
              fontSize: tokens.typography.fontSize.sm,
              lineHeight: tokens.typography.lineHeight.relaxed,
            }}
          >
            {item.blurb}
          </p>
        )}

        {(item.primaryLink || item.secondaryLink) && (
          <div className={`mt-auto flex flex-wrap gap-3 pt-2 ${alignment === "center" ? "justify-center" : alignment === "right" ? "justify-end" : ""}`}>
            {item.primaryLink && (
              <LinkButton link={item.primaryLink} variant="primary" isDark={isDark} />
            )}
            {item.secondaryLink && (
              <LinkButton link={item.secondaryLink} variant="secondary" isDark={isDark} />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Content item list row ────────────────────────────────────────────────────

function ContentItemRow({ item, blockTheme }: { item: ContentItem; blockTheme: "light" | "dark" }) {
  const isDark = (item.themeOverride ?? blockTheme) === "dark";
  const textPrimary = isDark ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary = isDark ? tokens.color.neutral[400] : tokens.color.neutral[600];

  return (
    <article
      className="flex gap-5 rounded-lg p-4 transition-colors hover:bg-black/5"
      style={{ fontFamily: tokens.typography.fontFamily.sans }}
    >
      {item.image?.url && (
        <img
          src={item.image.url}
          alt={item.image.alternativeText ?? item.title ?? ""}
          className="h-20 w-20 shrink-0 rounded-md object-cover"
          loading="lazy"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        {item.title && (
          <h3
            className="truncate"
            style={{
              color: textPrimary,
              fontSize: tokens.typography.fontSize.base,
              fontWeight: tokens.typography.fontWeight.semibold,
            }}
          >
            {item.title}
          </h3>
        )}
        {item.blurb && (
          <p
            style={{
              color: textSecondary,
              fontSize: tokens.typography.fontSize.sm,
              lineHeight: tokens.typography.lineHeight.relaxed,
            }}
            className="line-clamp-2"
          >
            {item.blurb}
          </p>
        )}
      </div>
      {item.primaryLink?.url && item.primaryLink?.label && (
        <div className="shrink-0 self-center">
          <LinkButton link={item.primaryLink} variant="primary" isDark={isDark} />
        </div>
      )}
    </article>
  );
}

// ─── Carousel view ────────────────────────────────────────────────────────────

interface CarouselViewProps {
  items: ContentItem[];
  interval: number;
  theme: "light" | "dark";
}

function CarouselView({ items, interval, theme }: CarouselViewProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || interval === 0 || paused) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [next, count, interval, paused]);

  const isDark = theme === "dark";

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <div className="relative overflow-hidden rounded-xl" style={{ minHeight: "420px" }}>
        {items.map((item, i) => (
          <div
            key={item.name}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: i === active ? 1 : 0,
              zIndex: i === active ? 1 : 0,
              pointerEvents: i === active ? "auto" : "none",
            }}
            aria-hidden={i !== active}
          >
            <ContentItemCard item={item} blockTheme={theme} />
          </div>
        ))}
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous item"
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: isDark ? tokens.color.neutral[600] : tokens.color.neutral[300],
              color: isDark ? tokens.color.neutral[200] : tokens.color.neutral[700],
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
            {items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-label={`Item ${i + 1}`}
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: "8px",
                  width: i === active ? "24px" : "8px",
                  backgroundColor:
                    i === active
                      ? tokens.color.brand.primary
                      : (isDark ? tokens.color.neutral[600] : tokens.color.neutral[300]),
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next item"
            className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: isDark ? tokens.color.neutral[600] : tokens.color.neutral[300],
              color: isDark ? tokens.color.neutral[200] : tokens.color.neutral[700],
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  alignment: "left" | "center" | "right";
  isDark: boolean;
  link?: StrapiLink;
}

function SectionHeader({ title, subtitle, alignment, isDark, link }: SectionHeaderProps) {
  if (!title && !subtitle) return null;

  const textPrimary = isDark ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary = isDark ? tokens.color.neutral[400] : tokens.color.neutral[600];

  return (
    <div
      className={`mb-10 max-w-2xl ${maxWidthAlignClass[alignment]} ${textAlignClass[alignment]}`}
      style={{ fontFamily: tokens.typography.fontFamily.sans }}
    >
      {title && (
        <h2
          style={{
            color: textPrimary,
            fontSize: tokens.typography.fontSize["3xl"],
            fontWeight: tokens.typography.fontWeight.bold,
            lineHeight: tokens.typography.lineHeight.tight,
            letterSpacing: tokens.typography.letterSpacing.tight,
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          style={{
            color: textSecondary,
            fontSize: tokens.typography.fontSize.lg,
            lineHeight: tokens.typography.lineHeight.relaxed,
            marginTop: tokens.spacing[3],
          }}
        >
          {subtitle}
        </p>
      )}
      {link?.url && link?.label && (
        <div className={`mt-6 ${alignment === "center" ? "flex justify-center" : alignment === "right" ? "flex justify-end" : ""}`}>
          <LinkButton link={link} variant="secondary" isDark={isDark} />
        </div>
      )}
    </div>
  );
}

// ─── ContentBlock ─────────────────────────────────────────────────────────────

export default function ContentBlock({
  title,
  subtitle,
  titleAlignment = "left",
  backgroundColour,
  backgroundImage,
  theme = "light",
  style = "card",
  columns = 3,
  layout = "grid",
  carouselInterval = 4000,
  link,
  items,
}: ContentBlockProps) {
  if (!items || items.length === 0) return <ContentBlockSkeleton />;

  const isDark = theme === "dark";
  const safeColumns = Math.max(1, Math.min(6, columns)) as keyof typeof gridColsClass;
  const hasBgImage = !!backgroundImage?.url;

  const sectionStyle: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily.sans,
    backgroundColor: !hasBgImage
      ? (backgroundColour ?? (isDark ? tokens.color.neutral[900] : tokens.color.neutral[50]))
      : undefined,
  };

  // ── Render items ──────────────────────────────────────────────────────────

  const renderItems = () => {
    // Carousel
    if (style === "carousel") {
      return (
        <CarouselView items={items} interval={carouselInterval} theme={theme} />
      );
    }

    // List
    if (style === "list") {
      return (
        <div className="flex flex-col divide-y" style={{ divideColor: isDark ? tokens.color.neutral[700] : tokens.color.neutral[200] }}>
          {items.map((item) => (
            <ContentItemRow key={item.name} item={item} blockTheme={theme} />
          ))}
        </div>
      );
    }

    // Masonry (CSS columns)
    if (style === "masonry") {
      return (
        <div
          style={{
            columns: `${safeColumns}`,
            columnGap: tokens.spacing[6],
          }}
        >
          {items.map((item) => (
            <div key={item.name} className="mb-6 break-inside-avoid">
              <ContentItemCard item={item} blockTheme={theme} />
            </div>
          ))}
        </div>
      );
    }

    // Card — layout variants
    if (layout === "alternating") {
      return (
        <div className="flex flex-col gap-16">
          {items.map((item, i) => {
            const isEven = i % 2 === 0;
            const isDarkItem = (item.themeOverride ?? theme) === "dark";
            const textPrimary = isDarkItem ? tokens.color.neutral[100] : tokens.color.neutral[900];
            const textSecondary = isDarkItem ? tokens.color.neutral[400] : tokens.color.neutral[600];

            return (
              <article
                key={item.name}
                className={`flex flex-col gap-8 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
              >
                {item.image?.url && (
                  <div className="w-full overflow-hidden rounded-xl md:w-1/2">
                    <img
                      src={item.image.url}
                      alt={item.image.alternativeText ?? item.title ?? ""}
                      className="h-64 w-full object-cover md:h-80"
                      loading="lazy"
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-4 ${item.image?.url ? "md:w-1/2" : "w-full"}`}
                  style={{ fontFamily: tokens.typography.fontFamily.sans }}
                >
                  {item.title && (
                    <h3
                      style={{
                        color: textPrimary,
                        fontSize: tokens.typography.fontSize["2xl"],
                        fontWeight: tokens.typography.fontWeight.bold,
                        lineHeight: tokens.typography.lineHeight.tight,
                      }}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.blurb && (
                    <p
                      style={{
                        color: textSecondary,
                        fontSize: tokens.typography.fontSize.base,
                        lineHeight: tokens.typography.lineHeight.relaxed,
                      }}
                    >
                      {item.blurb}
                    </p>
                  )}
                  {(item.primaryLink || item.secondaryLink) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {item.primaryLink && (
                        <LinkButton link={item.primaryLink} variant="primary" isDark={isDarkItem} />
                      )}
                      {item.secondaryLink && (
                        <LinkButton link={item.secondaryLink} variant="secondary" isDark={isDarkItem} />
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    if (layout === "featured") {
      const [featured, ...rest] = items;
      const isDarkFeatured = (featured.themeOverride ?? theme) === "dark";
      const textPrimary = isDarkFeatured ? tokens.color.neutral[100] : tokens.color.neutral[900];
      const textSecondary = isDarkFeatured ? tokens.color.neutral[400] : tokens.color.neutral[600];
      const featuredBg = featured.bgColour ?? (isDarkFeatured ? tokens.color.neutral[800] : tokens.color.brand.secondary);

      return (
        <div className="flex flex-col gap-8">
          {/* Featured item */}
          <article
            className="flex flex-col overflow-hidden rounded-xl md:flex-row"
            style={{
              backgroundColor: featuredBg,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {featured.image?.url && (
              <div className="h-64 w-full overflow-hidden md:h-auto md:w-1/2">
                <img
                  src={featured.image.url}
                  alt={featured.image.alternativeText ?? featured.title ?? ""}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2">
              {featured.title && (
                <h3
                  style={{
                    color: textPrimary,
                    fontSize: tokens.typography.fontSize["3xl"],
                    fontWeight: tokens.typography.fontWeight.bold,
                    lineHeight: tokens.typography.lineHeight.tight,
                  }}
                >
                  {featured.title}
                </h3>
              )}
              {featured.blurb && (
                <p
                  style={{
                    color: textSecondary,
                    fontSize: tokens.typography.fontSize.base,
                    lineHeight: tokens.typography.lineHeight.relaxed,
                  }}
                >
                  {featured.blurb}
                </p>
              )}
              {(featured.primaryLink || featured.secondaryLink) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {featured.primaryLink && (
                    <LinkButton link={featured.primaryLink} variant="primary" isDark={isDarkFeatured} />
                  )}
                  {featured.secondaryLink && (
                    <LinkButton link={featured.secondaryLink} variant="secondary" isDark={isDarkFeatured} />
                  )}
                </div>
              )}
            </div>
          </article>

          {/* Remaining items grid */}
          {rest.length > 0 && (
            <div className={`grid gap-6 ${gridColsClass[safeColumns] ?? gridColsClass[3]}`}>
              {rest.map((item) => (
                <ContentItemCard key={item.name} item={item} blockTheme={theme} compact />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default: grid
    return (
      <div className={`grid gap-6 ${gridColsClass[safeColumns] ?? gridColsClass[3]}`}>
        {items.map((item) => (
          <ContentItemCard key={item.name} item={item} blockTheme={theme} />
        ))}
      </div>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={sectionStyle}
      aria-label={title ?? "Content block"}
    >
      {/* Background image */}
      {hasBgImage && (
        <>
          <img
            src={backgroundImage!.url}
            alt={backgroundImage!.alternativeText ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: isDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.80)" }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            alignment={titleAlignment}
            isDark={isDark}
            link={link}
          />

          {renderItems()}

          {/* Section-level CTA link rendered below items when not in the header */}
          {link?.url && link?.label && (title || subtitle) && (
            <div className="mt-12 flex justify-center">
              <a
                href={link.url}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                style={{
                  color: isDark ? tokens.color.neutral[200] : tokens.color.neutral[700],
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight: tokens.typography.fontWeight.semibold,
                  letterSpacing: tokens.typography.letterSpacing.wide,
                  fontFamily: tokens.typography.fontFamily.sans,
                }}
                className="inline-flex items-center gap-1 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
