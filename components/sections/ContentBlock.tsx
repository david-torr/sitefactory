"use client";

import { useState, useEffect, useCallback } from "react";
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

export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  cover?: { url: string; formats?: { medium?: { url: string } } };
  category?: string;
  publishedAt?: string;
}

export interface ContentBlockProps {
  name: string;
  title?: string;
  subtitle?: string;
  titleAlignment?: "left" | "center" | "right";
  backgroundColour?: string;
  backgroundImage?: StrapiMedia;
  theme?: "light" | "dark";
  style?: "card" | "list" | "carousel" | "masonry" | "tile" | "media_text";
  columns?: number;
  layout?: "grid" | "alternating" | "featured" | "stack" | "scroll" | "carousel";
  carouselInterval?: number;
  link?: StrapiLink;
  items?: ContentItem[];
  /** Page-builder articles — converted to ContentItems internally */
  articles?: ArticleItem[];
  /** Media/text alternation direction */
  mediaAlignment?: "left" | "right";
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
      className="w-full animate-pulse bg-neutral-100 px-4 py-16 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading content"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-1/3 rounded-md bg-neutral-300" />
          <div className="h-4 w-1/2 rounded bg-neutral-200" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-neutral-200">
              <div className="h-48 w-full bg-neutral-300" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded bg-neutral-300" />
                <div className="h-4 w-full rounded bg-neutral-300" />
                <div className="h-4 w-5/6 rounded bg-neutral-300" />
                <div className="h-9 w-28 rounded-md pt-1 bg-neutral-300" />
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

  const variantClass =
    variant === "primary"
      ? "bg-neutral-900 text-white rounded-md text-sm font-semibold"
      : `border rounded-md text-sm font-medium ${
          isDark
            ? "border-neutral-500 text-neutral-200"
            : "border-neutral-300 text-neutral-700"
        }`;

  return (
    <a
      href={link.url}
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className={`inline-flex w-auto items-center px-5 py-2.5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClass}`}
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
  const titleClass = isDark ? "text-neutral-100" : "text-primary";
  const bodyClass = isDark ? "text-neutral-400" : "text-neutral-600";
  const alignment = item.alignment ?? "left";
  const videoSrc = item.video?.file?.url ?? item.video?.url;
  const hasMedia = !!(item.image?.url || videoSrc);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-lg font-body ${
        isDark ? "bg-neutral-800" : "bg-background"
      }`}
      style={{
        ...(item.bgColour ? { backgroundColor: item.bgColour } : {}),
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
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
      <div className={`flex flex-1 flex-col gap-3 p-5 ${textAlignClass[alignment]}`}>
        {item.title && (
          <h3 className={`font-display text-lg font-semibold leading-snug ${titleClass}`}>
            {item.title}
          </h3>
        )}
        {item.blurb && (
          <p className={`text-sm leading-relaxed ${bodyClass}`}>
            {item.blurb}
          </p>
        )}
        {(item.primaryLink || item.secondaryLink) && (
          <div
            className={`mt-auto flex flex-wrap gap-3 pt-2 ${
              alignment === "center"
                ? "justify-center"
                : alignment === "right"
                ? "justify-end"
                : ""
            }`}
          >
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

function ContentItemRow({
  item,
  blockTheme,
}: {
  item: ContentItem;
  blockTheme: "light" | "dark";
}) {
  const isDark = (item.themeOverride ?? blockTheme) === "dark";
  const titleClass = isDark ? "text-neutral-100" : "text-primary";
  const bodyClass = isDark ? "text-neutral-400" : "text-neutral-600";

  return (
    <article className="flex gap-5 rounded-lg p-4 font-body transition-colors hover:bg-black/5">
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
          <h3 className={`truncate font-display text-base font-semibold ${titleClass}`}>
            {item.title}
          </h3>
        )}
        {item.blurb && (
          <p className={`line-clamp-2 text-sm leading-relaxed ${bodyClass}`}>
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

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous item"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isDark
                ? "border-neutral-600 text-neutral-200"
                : "border-neutral-300 text-neutral-700"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "bg-accent"
                    : isDark
                    ? "bg-neutral-600"
                    : "bg-neutral-300"
                }`}
                style={{ height: "8px", width: i === active ? "24px" : "8px" }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next item"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isDark
                ? "border-neutral-600 text-neutral-200"
                : "border-neutral-300 text-neutral-700"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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

  const titleClass = isDark ? "text-neutral-100" : "text-primary";
  const bodyClass = isDark ? "text-neutral-400" : "text-neutral-600";

  return (
    <div
      className={`mb-10 max-w-2xl font-body ${maxWidthAlignClass[alignment]} ${textAlignClass[alignment]}`}
    >
      {title && (
        <h2
          className={`font-display text-3xl font-bold leading-tight tracking-tight ${titleClass}`}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-3 text-lg leading-relaxed ${bodyClass}`}>{subtitle}</p>
      )}
      {link?.url && link?.label && (
        <div
          className={`mt-6 ${
            alignment === "center"
              ? "flex justify-center"
              : alignment === "right"
              ? "flex justify-end"
              : ""
          }`}
        >
          <LinkButton link={link} variant="secondary" isDark={isDark} />
        </div>
      )}
    </div>
  );
}

// ─── ContentBlock ─────────────────────────────────────────────────────────────

// ─── Media-text row ──────────────────────────────────────────────────────────

interface MediaTextRowProps {
  article: ArticleItem;
  index: number;
  defaultMediaSide: "left" | "right";
  isDark: boolean;
}

function MediaTextRow({ article, index, defaultMediaSide, isDark }: MediaTextRowProps) {
  const mediaSide = index % 2 === 0 ? defaultMediaSide : (defaultMediaSide === "left" ? "right" : "left");
  const titleClass = isDark ? "text-neutral-100" : "text-primary";
  const bodyClass = isDark ? "text-neutral-400" : "text-neutral-500";
  const coverUrl = article.cover?.formats?.medium?.url ?? article.cover?.url;

  return (
    <article
      className={`flex flex-col md:flex-row ${mediaSide === "right" ? "md:flex-row-reverse" : ""}`}
    >
      {/* Image half */}
      <div className="w-full md:w-1/2">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={article.title}
            className="h-full min-h-[480px] w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[480px] w-full items-center justify-center bg-neutral-200" />
        )}
      </div>
      {/* Text half */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 md:px-16 md:py-20">
        {article.category && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {article.category}
          </p>
        )}
        <h3 className={`mb-4 font-display text-3xl font-bold ${titleClass}`}>
          {article.title}
        </h3>
        {article.excerpt && (
          <p className={`mb-8 max-w-md text-base leading-relaxed ${bodyClass}`}>
            {article.excerpt}
          </p>
        )}
        {article.slug && (
          <a
            href={`/${article.slug}`}
            className={`text-sm font-semibold ${isDark ? "text-neutral-200" : "text-neutral-800"}`}
          >
            Explore &rarr;
          </a>
        )}
      </div>
    </article>
  );
}

// ─── Scroll layout ───────────────────────────────────────────────────────────

function ScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
      {children}
    </div>
  );
}

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
  articles,
  mediaAlignment = "left",
}: ContentBlockProps) {
  // Convert articles to ContentItems if provided and no items given
  const resolvedItems: ContentItem[] | undefined = items ?? articles?.map((a) => ({
    name: a.slug,
    title: a.title,
    blurb: a.excerpt,
    image: a.cover ? { url: a.cover.formats?.medium?.url ?? a.cover.url } : undefined,
    primaryLink: a.slug ? { label: "View", url: `/${a.slug}` } : undefined,
  }));

  if ((!resolvedItems || resolvedItems.length === 0) && (!articles || articles.length === 0)) return <ContentBlockSkeleton />;

  const isDark = theme === "dark";
  const safeColumns = Math.max(1, Math.min(6, columns)) as keyof typeof gridColsClass;
  const hasBgImage = !!backgroundImage?.url;

  // ── Render items ──────────────────────────────────────────────────────────

  const renderItems = () => {
    // media_text style: handled separately in the section return below
    if (style === "media_text") return null;

    // tile style: icon-driven flat cards (like ObjectBlock)
    if (style === "tile" && resolvedItems) {
      return (
        <div className={`grid gap-6 ${gridColsClass[safeColumns] ?? gridColsClass[3]}`}>
          {resolvedItems.map((item) => {
            const itemDark = (item.themeOverride ?? theme) === "dark";
            const titleClass = itemDark ? "text-neutral-100" : "text-primary";
            const bodyClass = itemDark ? "text-neutral-400" : "text-neutral-600";
            return (
              <article
                key={item.name}
                className={`flex flex-col items-center gap-3 rounded-xl p-8 text-center font-body ${
                  itemDark ? "bg-neutral-800" : "bg-background"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  itemDark ? "bg-neutral-700" : "bg-neutral-200"
                }`} />
                {item.title && <h3 className={`font-display text-lg font-semibold ${titleClass}`}>{item.title}</h3>}
                {item.blurb && <p className={`text-sm leading-relaxed ${bodyClass}`}>{item.blurb}</p>}
              </article>
            );
          })}
        </div>
      );
    }

    if (!resolvedItems || resolvedItems.length === 0) return null;

    // scroll layout: horizontal scroll container
    if (layout === "scroll") {
      return (
        <ScrollLayout>
          {resolvedItems.map((item) => (
            <div key={item.name} className="w-80 shrink-0" style={{ scrollSnapAlign: "start" }}>
              <ContentItemCard item={item} blockTheme={theme} />
            </div>
          ))}
        </ScrollLayout>
      );
    }

    if (style === "carousel" || layout === "carousel") {
      return <CarouselView items={resolvedItems} interval={carouselInterval} theme={theme} />;
    }

    if (style === "list") {
      return (
        <div
          className={`flex flex-col divide-y ${
            isDark ? "divide-neutral-700" : "divide-neutral-200"
          }`}
        >
          {resolvedItems.map((item) => (
            <ContentItemRow key={item.name} item={item} blockTheme={theme} />
          ))}
        </div>
      );
    }

    if (style === "masonry") {
      return (
        <div style={{ columns: `${safeColumns}`, columnGap: "1.5rem" }}>
          {resolvedItems.map((item) => (
            <div key={item.name} className="mb-6 break-inside-avoid">
              <ContentItemCard item={item} blockTheme={theme} />
            </div>
          ))}
        </div>
      );
    }

    if (layout === "alternating") {
      return (
        <div className="flex flex-col gap-16">
          {resolvedItems.map((item, i) => {
            const isEven = i % 2 === 0;
            const isDarkItem = (item.themeOverride ?? theme) === "dark";
            const titleClass = isDarkItem ? "text-neutral-100" : "text-primary";
            const bodyClass = isDarkItem ? "text-neutral-400" : "text-neutral-600";

            return (
              <article
                key={item.name}
                className={`flex flex-col gap-8 md:flex-row md:items-center ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
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
                  className={`flex flex-col gap-4 font-body ${
                    item.image?.url ? "md:w-1/2" : "w-full"
                  }`}
                >
                  {item.title && (
                    <h3
                      className={`font-display text-2xl font-bold leading-tight ${titleClass}`}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.blurb && (
                    <p className={`text-base leading-relaxed ${bodyClass}`}>{item.blurb}</p>
                  )}
                  {(item.primaryLink || item.secondaryLink) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {item.primaryLink && (
                        <LinkButton
                          link={item.primaryLink}
                          variant="primary"
                          isDark={isDarkItem}
                        />
                      )}
                      {item.secondaryLink && (
                        <LinkButton
                          link={item.secondaryLink}
                          variant="secondary"
                          isDark={isDarkItem}
                        />
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
      const [featured, ...rest] = resolvedItems;
      const isDarkFeatured = (featured.themeOverride ?? theme) === "dark";
      const titleClass = isDarkFeatured ? "text-neutral-100" : "text-primary";
      const bodyClass = isDarkFeatured ? "text-neutral-400" : "text-neutral-600";

      return (
        <div className="flex flex-col gap-8">
          {/* Featured item */}
          <article
            className={`flex flex-col overflow-hidden rounded-xl md:flex-row ${
              isDarkFeatured ? "bg-neutral-800" : "bg-background"
            }`}
            style={{
              ...(featured.bgColour ? { backgroundColor: featured.bgColour } : {}),
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
            <div className="flex flex-col justify-center gap-4 p-8 font-body md:w-1/2">
              {featured.title && (
                <h3
                  className={`font-display text-3xl font-bold leading-tight ${titleClass}`}
                >
                  {featured.title}
                </h3>
              )}
              {featured.blurb && (
                <p className={`text-base leading-relaxed ${bodyClass}`}>{featured.blurb}</p>
              )}
              {(featured.primaryLink || featured.secondaryLink) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {featured.primaryLink && (
                    <LinkButton
                      link={featured.primaryLink}
                      variant="primary"
                      isDark={isDarkFeatured}
                    />
                  )}
                  {featured.secondaryLink && (
                    <LinkButton
                      link={featured.secondaryLink}
                      variant="secondary"
                      isDark={isDarkFeatured}
                    />
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

    // Default: grid (stack)
    return (
      <div className={`grid gap-6 ${gridColsClass[safeColumns] ?? gridColsClass[3]}`}>
        {resolvedItems.map((item) => (
          <ContentItemCard key={item.name} item={item} blockTheme={theme} />
        ))}
      </div>
    );
  };

  return (
    <section
      className={`relative w-full overflow-hidden font-body ${
        !hasBgImage ? (isDark ? "bg-primary" : "bg-neutral-50") : ""
      }`}
      style={!hasBgImage && backgroundColour ? { backgroundColor: backgroundColour } : undefined}
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

      {/* media_text: edge-to-edge layout with section header inside container */}
      {style === "media_text" && articles && articles.length > 0 && (
        <>
          {(title || subtitle) && (
            <div className="relative px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
              <div className="mx-auto max-w-7xl">
                <SectionHeader
                  title={title}
                  subtitle={subtitle}
                  alignment={titleAlignment}
                  isDark={isDark}
                />
              </div>
            </div>
          )}
          <div className="relative">
            {articles.map((article, i) => (
              <MediaTextRow
                key={article.id}
                article={article}
                index={i}
                defaultMediaSide={mediaAlignment}
                isDark={isDark}
              />
            ))}
          </div>
        </>
      )}

      {/* Standard layout: items inside max-w container */}
      {style !== "media_text" && (
      <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={title}
            subtitle={subtitle}
            alignment={titleAlignment}
            isDark={isDark}
          />

          {renderItems()}

          {/* Section-level CTA link rendered below items */}
          {link?.url && link?.label && (
            <div className="mt-12 flex justify-center">
              <a
                href={link.url}
                target={link.openInNewTab ? "_blank" : undefined}
                rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                className={`inline-flex items-center gap-1 font-body text-sm font-semibold tracking-wide underline underline-offset-4 transition-opacity hover:opacity-70 ${
                  isDark ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                {link.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
      )}
    </section>
  );
}
