"use client";

import { useState, useEffect, useCallback } from "react";
import tokens from "@/tokens/tokens.json";
import type { StrapiMedia, StrapiLink, StrapiVideo } from "./types";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LinkBarItem {
  icon?: StrapiMedia;
  title?: string;
  subtitle?: string;
  link?: StrapiLink;
}

export interface HeroSlide {
  name: string;
  title?: string;
  subtitle?: string;
  button1Label?: string;
  button2Label?: string;
  theme?: "light" | "dark";
  contentAlignment?: "left" | "center" | "right";
  bgColour?: string;
  bgImage?: StrapiMedia;
  button1Link?: StrapiLink;
  button2Link?: StrapiLink;
  backgroundVideo?: StrapiVideo;
}

export interface HeroHeaderProps {
  name: string;
  carouselSpeed?: number;
  contentAlignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
  linkBarVisible?: boolean;
  linkBarBgColour?: string;
  heroItems?: HeroSlide[];
  linkBarItems?: LinkBarItem[];
}

// ─── Alignment maps ───────────────────────────────────────────────────────────

const alignItemsClass: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const verticalJustifyClass: Record<string, string> = {
  top: "justify-start pt-24",
  middle: "justify-center",
  bottom: "justify-end pb-24",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HeroHeaderSkeleton() {
  return (
    <div
      className="relative w-full animate-pulse overflow-hidden"
      style={{
        height: "600px",
        backgroundColor: tokens.color.neutral[200],
      }}
      aria-busy="true"
      aria-label="Loading hero header"
    >
      <div className="flex h-full flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <div
            className="h-12 w-3/4 rounded-md"
            style={{ backgroundColor: tokens.color.neutral[300] }}
          />
          <div
            className="h-6 w-full rounded"
            style={{ backgroundColor: tokens.color.neutral[300] }}
          />
          <div
            className="h-6 w-2/3 rounded"
            style={{ backgroundColor: tokens.color.neutral[300] }}
          />
          <div className="flex gap-3 pt-2">
            <div
              className="h-12 w-36 rounded-md"
              style={{ backgroundColor: tokens.color.neutral[300] }}
            />
            <div
              className="h-12 w-36 rounded-md"
              style={{ backgroundColor: tokens.color.neutral[300] }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Individual slide ─────────────────────────────────────────────────────────

interface SlideProps {
  slide: HeroSlide;
  defaultAlignment: "left" | "center" | "right";
  defaultVertical: "top" | "middle" | "bottom";
}

function Slide({ slide, defaultAlignment, defaultVertical }: SlideProps) {
  const alignment = slide.contentAlignment ?? defaultAlignment;
  const isDark = (slide.theme ?? "light") === "dark";
  const hasMedia = !!(slide.bgImage?.url || slide.backgroundVideo?.url);

  const titleColor = isDark
    ? tokens.color.neutral[100]
    : hasMedia
    ? "#ffffff"
    : tokens.color.neutral[900];
  const subtitleColor = isDark
    ? tokens.color.neutral[300]
    : hasMedia
    ? "rgba(255,255,255,0.88)"
    : tokens.color.neutral[600];

  const videoSrc =
    slide.backgroundVideo?.file?.url ?? slide.backgroundVideo?.url;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: slide.bgColour ?? tokens.color.neutral[800] }}
    >
      {/* Background image */}
      {slide.bgImage?.url && (
        <img
          src={slide.bgImage.url}
          alt={slide.bgImage.alternativeText ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      )}

      {/* Background video */}
      {videoSrc && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}

      {/* Gradient overlay (when media is present) */}
      {hasMedia && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.50) 60%, rgba(0,0,0,0.65) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Slide content */}
      <div
        className={`relative flex h-full flex-col px-6 sm:px-10 md:px-16 lg:px-24 ${verticalJustifyClass[defaultVertical]}`}
      >
        <div
          className={`flex max-w-3xl flex-col gap-5 ${alignItemsClass[alignment]}`}
          style={{ fontFamily: tokens.typography.fontFamily.sans }}
        >
          {slide.title && (
            <h1
              className="sm:text-6xl"
              style={{
                color: titleColor,
                fontSize: tokens.typography.fontSize["5xl"],
                fontWeight: tokens.typography.fontWeight.bold,
                lineHeight: tokens.typography.lineHeight.tight,
                letterSpacing: tokens.typography.letterSpacing.tight,
              }}
            >
              {slide.title}
            </h1>
          )}

          {slide.subtitle && (
            <p
              className="sm:text-xl"
              style={{
                color: subtitleColor,
                fontSize: tokens.typography.fontSize.lg,
                lineHeight: tokens.typography.lineHeight.relaxed,
                maxWidth: "36rem",
              }}
            >
              {slide.subtitle}
            </p>
          )}

          {(slide.button1Label || slide.button2Label) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {slide.button1Label && (
                <a
                  href={slide.button1Link?.url ?? "#"}
                  target={slide.button1Link?.openInNewTab ? "_blank" : undefined}
                  rel={
                    slide.button1Link?.openInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    backgroundColor: tokens.color.brand.secondary,
                    color: tokens.color.brand.primary,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    fontSize: tokens.typography.fontSize.sm,
                    borderRadius: tokens.borderRadius.md,
                    letterSpacing: tokens.typography.letterSpacing.wide,
                  }}
                  className="inline-flex items-center px-7 py-3.5 transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {slide.button1Label}
                </a>
              )}

              {slide.button2Label && (
                <a
                  href={slide.button2Link?.url ?? "#"}
                  target={slide.button2Link?.openInNewTab ? "_blank" : undefined}
                  rel={
                    slide.button2Link?.openInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  style={{
                    border: "2px solid rgba(255,255,255,0.75)",
                    color: "#ffffff",
                    fontWeight: tokens.typography.fontWeight.semibold,
                    fontSize: tokens.typography.fontSize.sm,
                    borderRadius: tokens.borderRadius.md,
                    letterSpacing: tokens.typography.letterSpacing.wide,
                  }}
                  className="inline-flex items-center px-7 py-3.5 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {slide.button2Label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Link bar ─────────────────────────────────────────────────────────────────

interface LinkBarProps {
  items: LinkBarItem[];
  bgColour?: string;
}

function LinkBar({ items, bgColour }: LinkBarProps) {
  return (
    <div
      style={{
        backgroundColor: bgColour ?? tokens.color.neutral[100],
        borderTopColor: tokens.color.neutral[200],
        fontFamily: tokens.typography.fontFamily.sans,
      }}
      className="border-t"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap divide-x divide-neutral-200">
          {items.map((item, i) => (
            <li key={i} className="flex-1 min-w-[160px]">
              <a
                href={item.link?.url ?? "#"}
                target={item.link?.openInNewTab ? "_blank" : undefined}
                rel={item.link?.openInNewTab ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-black/5"
                style={{ borderRightColor: tokens.color.neutral[200] }}
              >
                {item.icon?.url && (
                  <img
                    src={item.icon.url}
                    alt={item.icon.alternativeText ?? ""}
                    className="h-8 w-8 shrink-0 object-contain"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                  {item.title && (
                    <p
                      className="truncate"
                      style={{
                        fontWeight: tokens.typography.fontWeight.semibold,
                        fontSize: tokens.typography.fontSize.sm,
                        color: tokens.color.neutral[800],
                      }}
                    >
                      {item.title}
                    </p>
                  )}
                  {item.subtitle && (
                    <p
                      className="truncate"
                      style={{
                        fontSize: tokens.typography.fontSize.xs,
                        color: tokens.color.neutral[500],
                        marginTop: "2px",
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── HeroHeader ───────────────────────────────────────────────────────────────

export default function HeroHeader({
  carouselSpeed = 5000,
  contentAlignment = "left",
  verticalAlignment = "middle",
  linkBarVisible = false,
  linkBarBgColour,
  heroItems,
  linkBarItems,
}: HeroHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = heroItems?.length ?? 0;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1 || carouselSpeed === 0 || paused) return;
    const timer = setInterval(next, carouselSpeed);
    return () => clearInterval(timer);
  }, [next, slideCount, carouselSpeed, paused]);

  if (!heroItems || heroItems.length === 0) {
    return <HeroHeaderSkeleton />;
  }

  return (
    <section
      style={{ fontFamily: tokens.typography.fontFamily.sans }}
      aria-label="Hero header"
      className="relative w-full"
    >
      {/* Slide viewport */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(480px, 80vh, 760px)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {heroItems.map((slide, i) => (
          <div
            key={slide.name}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              zIndex: i === activeIndex ? 1 : 0,
              pointerEvents: i === activeIndex ? "auto" : "none",
            }}
            aria-hidden={i !== activeIndex}
          >
            <Slide
              slide={slide}
              defaultAlignment={contentAlignment}
              defaultVertical={verticalAlignment}
            />
          </div>
        ))}

        {/* Prev / Next arrows */}
        {slideCount > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <svg
                width="20"
                height="20"
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

            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <svg
                width="20"
                height="20"
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
          </>
        )}

        {/* Dot indicators */}
        {slideCount > 1 && (
          <div
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
            role="tablist"
            aria-label="Slide indicators"
          >
            {heroItems.map((slide, i) => (
              <button
                key={slide.name}
                type="button"
                role="tab"
                aria-label={`Slide ${i + 1}${slide.title ? `: ${slide.title}` : ""}`}
                aria-selected={i === activeIndex}
                onClick={() => setActiveIndex(i)}
                className="rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                style={{
                  height: "8px",
                  width: i === activeIndex ? "24px" : "8px",
                  backgroundColor:
                    i === activeIndex
                      ? "#ffffff"
                      : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Link bar */}
      {linkBarVisible && linkBarItems && linkBarItems.length > 0 && (
        <LinkBar items={linkBarItems} bgColour={linkBarBgColour} />
      )}
    </section>
  );
}
