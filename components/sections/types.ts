/**
 * Shared Strapi data-shape types used across all section components.
 * These mirror the Strapi REST API response structure for media, links, and video.
 */

export interface StrapiMedia {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  mime?: string;
}

export interface StrapiLink {
  label?: string;
  url?: string;
  openInNewTab?: boolean;
}

export interface StrapiVideo {
  name?: string;
  /** Uploaded file asset */
  file?: StrapiMedia;
  /** External URL (YouTube / Vimeo) */
  url?: string;
}
