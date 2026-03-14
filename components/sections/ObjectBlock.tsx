"use client";

import { useState, useEffect, useCallback } from "react";
import tokens from "@/tokens/tokens.json";
import type { StrapiMedia, StrapiLink } from "./types";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ObjectItem {
  name: string;
  icon?: StrapiMedia;
  title?: string;
  blurb?: string;
  backgroundColour?: string;
  primaryButtonLink?: StrapiLink;
  secondaryButtonLink?: StrapiLink;
}

export interface ObjectBlockProps {
  name: string;
  title?: string;
  subtitle?: string;
  titleAlignment?: "left" | "center" | "right";
  backgroundColour?: string;
  backgroundImage?: StrapiMedia;
  theme?: "light" | "dark";
  columns?: number;
  layout?: "grid" | "alternating" | "carousel";
  carouselInterval?: number;
  link?: StrapiLink;
  items?: ObjectItem[];
}

// ─── Column grid class map ────────────────────────────────────────────────────

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

function ObjectBlockSkeleton() {
  return (
    <div
      className="w-full animate-pulse px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundColor: tokens.color.neutral[100] }}
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div
            className="mx-auto h-8 w-1/3 rounded-md"
            style={{ backgroundColor: tokens.color.neutral[300] }}
          />
          <div
            className="mx-auto h-4 w-2/5 rounded"
            style={{ backgroundColor: tokens.color.neutral[200] }}
          />
        </div>

        {/* Object item skeletons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 rounded-xl p-6"
              style={{ backgroundColor: tokens.color.neutral[200] }}
            >
              <div
                className="h-14 w-14 rounded-full"
                style={{ backgroundColor: tokens.color.neutral[300] }}
              />
              <div
                className="h-5 w-1/2 rounded"
                style={{ backgroundColor: tokens.color.neutral[300] }}
              />
              <div
                className="h-4 w-full rounded"
                style={{ backgroundColor: tokens.color.neutral[300] }}
              />
              <div
                className="h-4 w-4/5 rounded"
                style={{ backgroundColor: tokens.color.neutral[300] }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Link button ──────────────────────────────────────────────────────────────

interface LinkButtonProps {
  link: StrapiLink;
  variant: "primary" | "secondary";
  isDark: boolean;
}

function LinkButton({ link, variant, isDark }: LinkButtonProps) {
  if (!link.label || !link.url) return null;

  const style: React.CSSProperties =
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
      style={style}
      className="inline-flex items-center px-5 py-2.5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {link.label}
    </a>
  );
}

// ─── Object item card ─────────────────────────────────────────────────────────

interface ObjectItemCardProps {
  item: ObjectItem;
  blockTheme: "light" | "dark";
  /** Center-align content (useful for grid layouts) */
  centered?: boolean;
}

function ObjectItemCard({ item, blockTheme, centered = false }: ObjectItemCardProps) {
  const isDark = blockTheme === "dark";
  const textPrimary = isDark ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary = isDark ? tokens.color.neutral[400] : tokens.color.neutral[600];
  const cardBg =
    item.backgroundColour ?? (isDark ? tokens.color.neutral[800] : tokens.color.brand.secondary);
  const alignClass = centered ? "items-center text-center" : "items-start text-left";

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-xl p-6 ${alignClass}`}
      style={{
        backgroundColor: cardBg,
        boxShadow: isDark
          ? "0 1px 3px rgba(0,0,0,0.30)"
          : "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        fontFamily: tokens.typography.fontFamily.sans,
      }}
    >
      {/* Icon */}
      {item.icon?.url && (
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{
            backgroundColor: isDark ? tokens.color.neutral[700] : tokens.color.neutral[100],
          }}
        >
          <img
            src={item.icon.url}
            alt={item.icon.alternativeText ?? ""}
            className="h-8 w-8 object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Title */}
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

      {/* Blurb */}
      {item.blurb && (
        <p
          className="flex-1"
          style={{
            color: textSecondary,
            fontSize: tokens.typography.fontSize.sm,
            lineHeight: tokens.typography.lineHeight.relaxed,
          }}
        >
          {item.blurb}
        </p>
      )}

      {/* Buttons */}
      {(item.primaryButtonLink || item.secondaryButtonLink) && (
        <div
          className={`mt-auto flex flex-wrap gap-3 pt-2 ${centered ? "justify-center" : ""}`}
        >
          {item.primaryButtonLink && (
            <LinkButton link={item.primaryButtonLink} variant="primary" isDark={isDark} />
          )}
          {item.secondaryButtonLink && (
            <LinkButton link={item.secondaryButtonLink} variant="secondary" isDark={isDark} />
          )}
        </div>
      )}
    </article>
  );
}

// ─── Alternating layout row ───────────────────────────────────────────────────

interface AlternatingRowProps {
  item: ObjectItem;
  index: number;
  blockTheme: "light" | "dark";
}

function AlternatingRow({ item, index, blockTheme }: AlternatingRowProps) {
  const isEven = index % 2 === 0;
  const isDark = blockTheme === "dark";
  const textPrimary = isDark ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary = isDark ? tokens.color.neutral[400] : tokens.color.neutral[600];

  return (
    <article
      className={`flex flex-col gap-8 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
    >
      {/* Icon panel */}
      <div
        className="flex w-full shrink-0 items-center justify-center rounded-2xl p-10 md:w-2/5"
        style={{
          backgroundColor: item.backgroundColour ?? (isDark ? tokens.color.neutral[800] : tokens.color.neutral[100]),
          minHeight: "200px",
        }}
      >
        {item.icon?.url ? (
          <img
            src={item.icon.url}
            alt={item.icon.alternativeText ?? ""}
            className="h-20 w-20 object-contain"
            loading="lazy"
          />
        ) : (
          /* Placeholder icon when no icon provided */
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? tokens.color.neutral[700] : tokens.color.neutral[200] }}
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: isDark ? tokens.color.neutral[400] : tokens.color.neutral[400] }}
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div
        className="flex flex-col gap-4 md:w-3/5"
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
        {(item.primaryButtonLink || item.secondaryButtonLink) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {item.primaryButtonLink && (
              <LinkButton link={item.primaryButtonLink} variant="primary" isDark={isDark} />
            )}
            {item.secondaryButtonLink && (
              <LinkButton link={item.secondaryButtonLink} variant="secondary" isDark={isDark} />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface CarouselViewProps {
  items: ObjectItem[];
  interval: number;
  theme: "light" | "dark";
}

function CarouselView({ items, interval, theme }: CarouselViewProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  const isDark = theme === "dark";

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1 || interval === 0 || paused) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [next, count, interval, paused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-xl" style={{ minHeight: "300px" }}>
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
            <ObjectItemCard item={item} blockTheme={theme} centered />
          </div>
        ))}
      </div>

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

          <div className="flex items-center gap-2" role="tablist" aria-label="Item indicators">
            {items.map((item, i) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-label={`Item ${i + 1}${item.title ? `: ${item.title}` : ""}`}
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: "8px",
                  width: i === active ? "24px" : "8px",
                  backgroundColor:
                    i === active
                      ? tokens.color.brand.primary
                      : isDark
                      ? tokens.color.neutral[600]
                      : tokens.color.neutral[300],
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

// ─── ObjectBlock ──────────────────────────────────────────────────────────────

export default function ObjectBlock({
  title,
  subtitle,
  titleAlignment = "left",
  backgroundColour,
  backgroundImage,
  theme = "light",
  columns = 3,
  layout = "grid",
  carouselInterval = 4000,
  link,
  items,
}: ObjectBlockProps) {
  if (!items || items.length === 0) return <ObjectBlockSkeleton />;

  const isDark = theme === "dark";
  const safeColumns = Math.max(1, Math.min(6, columns)) as keyof typeof gridColsClass;
  const hasBgImage = !!backgroundImage?.url;

  const sectionStyle: React.CSSProperties = {
    fontFamily: tokens.typography.fontFamily.sans,
    backgroundColor: !hasBgImage
      ? (backgroundColour ?? (isDark ? tokens.color.neutral[900] : tokens.color.neutral[50]))
      : undefined,
  };

  const renderItems = () => {
    if (layout === "carousel") {
      return (
        <CarouselView items={items} interval={carouselInterval} theme={theme} />
      );
    }

    if (layout === "alternating") {
      return (
        <div className="flex flex-col gap-16">
          {items.map((item, i) => (
            <AlternatingRow key={item.name} item={item} index={i} blockTheme={theme} />
          ))}
        </div>
      );
    }

    // Default: grid (centered cards work well for icon-driven items)
    const isCentered = titleAlignment === "center";
    return (
      <div className={`grid gap-6 ${gridColsClass[safeColumns] ?? gridColsClass[3]}`}>
        {items.map((item) => (
          <ObjectItemCard key={item.name} item={item} blockTheme={theme} centered={isCentered} />
        ))}
      </div>
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={sectionStyle}
      aria-label={title ?? "Object block"}
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

          {/* Section-level CTA */}
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
