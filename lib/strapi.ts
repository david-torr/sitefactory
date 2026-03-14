/**
 * Strapi v4 REST API helpers.
 * Uses STRAPI_URL and STRAPI_API_TOKEN environment variables.
 */

import type { HeroHeaderProps, HeroSlide, LinkBarItem } from "@/components/sections/HeroHeader";
import type { ContentBlockProps, ContentItem } from "@/components/sections/ContentBlock";
import type { ObjectBlockProps, ObjectItem } from "@/components/sections/ObjectBlock";
import type { StandardHeaderProps } from "@/components/sections/StandardHeader";
import type { StrapiMedia, StrapiLink, StrapiVideo } from "@/components/sections/types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

// ─── Core fetch helper ────────────────────────────────────────────────────────

export async function fetchStrapi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── Strapi v4 response unwrappers ────────────────────────────────────────────

function unwrapMedia(data: any): StrapiMedia | undefined {
  if (!data?.data?.attributes) return undefined;
  return data.data.attributes as StrapiMedia;
}

function unwrapLink(data: any): StrapiLink | undefined {
  if (!data?.data?.attributes) return undefined;
  const a = data.data.attributes;
  return { label: a.label, url: a.url, openInNewTab: a.openInNewTab };
}

function unwrapVideo(data: any): StrapiVideo | undefined {
  if (!data?.data?.attributes) return undefined;
  const a = data.data.attributes;
  return { name: a.name, url: a.url, file: unwrapMedia(a.file) };
}

// ─── Single type fetchers ─────────────────────────────────────────────────────

export async function getSiteNav() {
  const res = await fetchStrapi<any>("site-nav?populate[navItems][populate]=*&populate[ctaButtonLink]=*");
  return res?.data?.attributes ?? null;
}

export async function getSiteFooter() {
  const res = await fetchStrapi<any>("site-footer?populate[logo]=*&populate[navigationColumns][populate][links]=*&populate[legalLinks]=*");
  return res?.data?.attributes ?? null;
}

// ─── Collection type fetchers ─────────────────────────────────────────────────

export async function getHeroHeaders(): Promise<HeroHeaderProps[]> {
  const res = await fetchStrapi<any>("hero-headers?populate[heroItems][populate]=*&populate[linkBarItems]=*");
  if (!res?.data?.length) return [];

  return res.data.map((item: any): HeroHeaderProps => {
    const a = item.attributes;
    return {
      name: a.name,
      carouselSpeed: a.carouselSpeed,
      contentAlignment: a.contentAlignment,
      verticalAlignment: a.verticalAlignment,
      linkBarVisible: a.linkBarVisible,
      linkBarBgColour: a.linkBarBgColour,
      heroItems: (a.heroItems?.data ?? []).map((slide: any): HeroSlide => {
        const s = slide.attributes;
        return {
          name: s.name,
          title: s.title,
          subtitle: s.subtitle,
          button1Label: s.button1Label,
          button2Label: s.button2Label,
          theme: s.theme,
          contentAlignment: s.contentAlignment,
          bgColour: s.bgColour,
          bgImage: unwrapMedia(s.bgImage),
          button1Link: unwrapLink(s.button1Link),
          button2Link: unwrapLink(s.button2Link),
          backgroundVideo: unwrapVideo(s.backgroundVideo),
        };
      }),
      linkBarItems: (a.linkBarItems ?? []).map((lbi: any): LinkBarItem => ({
        icon: unwrapMedia(lbi.icon),
        title: lbi.title,
        subtitle: lbi.subtitle,
        link: lbi.link
          ? { label: lbi.link.label, url: lbi.link.url, openInNewTab: lbi.link.openInNewTab }
          : undefined,
      })),
    };
  });
}

export async function getContentBlocks(): Promise<ContentBlockProps[]> {
  const res = await fetchStrapi<any>("content-blocks?populate[backgroundImage]=*&populate[link]=*&populate[items][populate]=*");
  if (!res?.data?.length) return [];

  return res.data.map((item: any): ContentBlockProps => {
    const a = item.attributes;
    return {
      name: a.name,
      title: a.title,
      subtitle: a.subtitle,
      titleAlignment: a.titleAlignment,
      backgroundColour: a.backgroundColour,
      backgroundImage: unwrapMedia(a.backgroundImage),
      theme: a.theme,
      style: a.style,
      columns: a.columns,
      layout: a.layout,
      carouselInterval: a.carouselInterval,
      link: unwrapLink(a.link),
      items: (a.items?.data ?? []).map((ci: any): ContentItem => {
        const s = ci.attributes;
        return {
          name: s.name,
          title: s.title,
          blurb: s.blurb,
          image: unwrapMedia(s.image),
          bgColour: s.bgColour,
          alignment: s.alignment,
          themeOverride: s.themeOverride,
          primaryLink: unwrapLink(s.primaryLink),
          secondaryLink: unwrapLink(s.secondaryLink),
          video: unwrapVideo(s.video),
        };
      }),
    };
  });
}

export async function getObjectBlocks(): Promise<ObjectBlockProps[]> {
  const res = await fetchStrapi<any>("object-blocks?populate[backgroundImage]=*&populate[link]=*&populate[items][populate]=*");
  if (!res?.data?.length) return [];

  return res.data.map((item: any): ObjectBlockProps => {
    const a = item.attributes;
    return {
      name: a.name,
      title: a.title,
      subtitle: a.subtitle,
      titleAlignment: a.titleAlignment,
      backgroundColour: a.backgroundColour,
      backgroundImage: unwrapMedia(a.backgroundImage),
      theme: a.theme,
      columns: a.columns,
      layout: a.layout,
      carouselInterval: a.carouselInterval,
      link: unwrapLink(a.link),
      items: (a.items?.data ?? []).map((oi: any): ObjectItem => {
        const s = oi.attributes;
        return {
          name: s.name,
          icon: unwrapMedia(s.icon),
          title: s.title,
          blurb: s.blurb,
          backgroundColour: s.backgroundColour,
          primaryButtonLink: unwrapLink(s.primaryButtonLink),
          secondaryButtonLink: unwrapLink(s.secondaryButtonLink),
        };
      }),
    };
  });
}

export async function getStandardHeaders(): Promise<StandardHeaderProps[]> {
  const res = await fetchStrapi<any>("standard-headers?populate[bgImage]=*");
  if (!res?.data?.length) return [];

  return res.data.map((item: any): StandardHeaderProps => {
    const a = item.attributes;
    return {
      name: a.name,
      theme: a.theme,
      backgroundType: a.backgroundType,
      bgColour: a.bgColour,
      bgImage: unwrapMedia(a.bgImage),
      title: a.title,
      subtitle: a.subtitle,
      contentAlignment: a.contentAlignment,
    };
  });
}
