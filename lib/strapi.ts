/**
 * Strapi v4 REST API helpers.
 * Uses STRAPI_URL and STRAPI_API_TOKEN environment variables.
 */

import type { PageType } from "@/types/page-builder";
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

// ─── Page builder fetcher ────────────────────────────────────────────────────

export async function getPage(slug: string): Promise<PageType | null> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? STRAPI_URL;
    const url = `${strapiUrl}/api/pages?` +
      `filters[slug][$eq]=${slug}` +
      `&populate[sections][populate][articles][populate]=cover` +
      `&populate[sections][populate][items][populate]=background_image` +
      `&populate[sections][populate][items][populate]=cta_primary` +
      `&populate[sections][populate][items][populate]=cta_secondary` +
      `&populate[sections][populate][link_bar_items][populate]=icon` +
      `&populate[sections][populate][link_bar_items][populate]=link` +
      `&populate[sections][populate][nav_items]=*` +
      `&populate[sections][populate][cta_link]=*` +
      `&populate[sections][populate][logo_default]=*` +
      `&populate[sections][populate][logo_scrolled]=*` +
      `&populate[sections][populate][logo]=*` +
      `&populate[sections][populate][nav_columns][populate]=links` +
      `&populate[sections][populate][legal_links]=*`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return getMockPage(slug);
    const json = await res.json();
    const raw = json?.data?.[0];
    if (!raw) return getMockPage(slug);

    return {
      id: raw.id,
      ...raw.attributes,
      sections: (raw.attributes.sections || []).map((s: any) => ({
        ...s,
        articles: s.articles?.data?.map((a: any) => ({
          id: a.id,
          ...a.attributes,
          cover: a.attributes.cover?.data ? {
            url: a.attributes.cover.data.attributes.url,
            formats: a.attributes.cover.data.attributes.formats
          } : undefined
        })) ?? s.articles ?? []
      }))
    };
  } catch {
    return getMockPage(slug);
  }
}

function getMockPage(slug: string): PageType | null {
  if (slug !== 'home') return null;
  return {
    id: 1,
    title: 'Home',
    slug: 'home',
    sections: [
      {
        __component: 'sections.site-nav',
        display_mode: 'overlay',
        theme: 'dark',
        scroll_behaviour: 'become_solid',
        scrolled_bg_colour: '#ffffff',
        scrolled_theme: 'light',
        cta_label: 'Get started',
        cta_link: { label: 'Get started', url: '#' },
        nav_items: [
          { label: 'Solutions', url: '#' },
          { label: 'Work', url: '#' },
          { label: 'About', url: '#' },
          { label: 'Blog', url: '#' }
        ]
      },
      {
        __component: 'sections.hero-header',
        name: 'Main Hero',
        header_type: 'hero',
        carousel_speed: 'slow',
        content_alignment: 'left',
        vertical_alignment: 'middle',
        items: [
          {
            title: 'Design beyond expectation.',
            description: 'We partner with ambitious brands to create digital experiences that define categories and move markets.',
            theme: 'dark',
            cta_primary: { label: 'See our work', url: '#' },
            cta_secondary: { label: 'Talk to us', url: '#' }
          },
          {
            title: 'Built for performance at scale.',
            description: 'From early-stage startups to global enterprises, we bring precision engineering to every product we ship.',
            theme: 'dark',
            cta_primary: { label: 'Our approach', url: '#' }
          },
          {
            title: 'Where craft meets strategy.',
            description: 'The best products live at the intersection of beautiful design and rigorous, evidence-based thinking.',
            theme: 'dark',
            cta_primary: { label: 'Start a project', url: '#' },
            cta_secondary: { label: 'View case studies', url: '#' }
          }
        ],
        link_bar: true,
        link_bar_bg: '#f5f5f5',
        link_bar_items: [
          { label: 'Brand Identity', subtitle: 'Positioning, identity & design systems' },
          { label: 'Web & Product', subtitle: 'Next.js, React & mobile applications' },
          { label: 'Growth Strategy', subtitle: 'Analytics, SEO & performance marketing' }
        ]
      },
      {
        __component: 'sections.content-block',
        name: 'Selected Work',
        title: 'Selected work',
        subtitle: 'Recent projects across brand, digital, and product strategy.',
        title_alignment: 'left',
        background: 'colour',
        bg_colour: '#ffffff',
        theme: 'light',
        style: 'card',
        media_alignment: 'left',
        columns: '3',
        layout: 'stack',
        articles: [
          { id: 1, title: 'Apex Financial — Brand Overhaul', slug: 'apex', excerpt: 'Complete brand refresh for a Series B fintech.', category: 'Brand Identity' },
          { id: 2, title: 'Orbit — Logistics Platform', slug: 'orbit', excerpt: 'End-to-end design for a real-time logistics dashboard.', category: 'Web & Product' },
          { id: 3, title: 'Vessel — Luxury E-commerce', slug: 'vessel', excerpt: 'Custom Shopify storefront for a luxury brand.', category: 'Growth Strategy' }
        ]
      },
      {
        __component: 'sections.content-block',
        name: 'Our Stages',
        title: 'Our stages',
        subtitle: 'Each space designed for a different kind of experience.',
        title_alignment: 'left',
        background: 'colour',
        bg_colour: '#fafafa',
        theme: 'light',
        style: 'media_text',
        media_alignment: 'left',
        columns: '1',
        layout: 'stack',
        articles: [
          { id: 4, title: 'The Main Stage', slug: 'main-stage', excerpt: 'Our flagship 2,000-seat auditorium, designed for grand-scale productions with state-of-the-art acoustics.', category: 'Explore the space' },
          { id: 5, title: 'Studio Theatre', slug: 'studio', excerpt: 'An intimate 350-seat black box venue for experimental and emerging works.', category: 'Explore the space' }
        ]
      },
      {
        __component: 'sections.object-block',
        name: 'What We Do',
        title: 'What we do',
        subtitle: 'End-to-end capabilities across the full digital product lifecycle.',
        title_alignment: 'centre',
        background: 'colour',
        bg_colour: '#171717',
        theme: 'dark',
        columns: '3',
        layout: 'stack',
        articles: [
          { id: 1, title: 'Brand Strategy', slug: 'brand', excerpt: 'Define your market position, tone of voice, and visual identity with a cohesive brand system built to scale.', category: 'Brand' },
          { id: 2, title: 'Product Design', slug: 'design', excerpt: 'User research, interaction design, prototyping, and design systems that put people at the centre.', category: 'Design' },
          { id: 3, title: 'Web Development', slug: 'web', excerpt: 'High-performance Next.js applications with clean architecture, accessibility built in.', category: 'Tech' },
          { id: 4, title: 'Content Strategy', slug: 'content', excerpt: 'Purposeful content frameworks that attract the right audience and drive meaningful action.', category: 'Content' },
          { id: 5, title: 'Growth Marketing', slug: 'growth', excerpt: 'Data-driven acquisition and retention programmes across paid, organic, and lifecycle channels.', category: 'Growth' },
          { id: 6, title: 'Analytics & Insights', slug: 'analytics', excerpt: 'Measurement infrastructure, dashboards, and regular reporting so you always know what\'s working.', category: 'Analytics' }
        ]
      },
      {
        __component: 'sections.footer-block',
        name: 'Footer',
        copyright_text: '\u00A9 2026 Forma Studio Ltd. All rights reserved.',
        nav_columns: [
          { title: 'Work', links: [
            { label: 'Case Studies', url: '#' },
            { label: 'Our Process', url: '#' },
            { label: 'Results', url: '#' },
            { label: 'Testimonials', url: '#' }
          ]},
          { title: 'Studio', links: [
            { label: 'About', url: '#' },
            { label: 'Team', url: '#' },
            { label: 'Careers', url: '#' },
            { label: 'Press', url: '#' }
          ]},
          { title: 'Connect', links: [
            { label: 'Blog', url: '#' },
            { label: 'Newsletter', url: '#' },
            { label: 'Contact', url: '#' },
            { label: 'LinkedIn', url: '#' }
          ]}
        ],
        legal_links: [
          { label: 'Privacy Policy', url: '/privacy-policy' },
          { label: 'Terms of Service', url: '/terms' },
          { label: 'Cookies', url: '/cookies' }
        ]
      }
    ]
  };
}
