export type LinkType = {
  label: string
  url: string
  open_in_new_tab?: boolean
}

export type HeroItemType = {
  title: string
  description?: string
  theme: 'dark' | 'light'
  background_image?: { url: string }
  cta_primary?: LinkType
  cta_secondary?: LinkType
}

export type LinkBarItemType = {
  icon?: { url: string }
  label: string
  subtitle?: string
  link?: LinkType
}

export type FooterColumnType = {
  title: string
  links: LinkType[]
}

export type ArticleType = {
  id: number
  title: string
  slug: string
  excerpt?: string
  cover?: { url: string; formats?: { medium?: { url: string } } }
  category?: string
  publishedAt?: string
}

export type SiteNavSection = {
  __component: 'sections.site-nav'
  logo_default?: { url: string }
  site_name?: string
  display_mode: 'solid' | 'overlay'
  theme: 'dark' | 'light'
  scroll_behaviour: 'no_change' | 'become_solid' | 'hide'
  scrolled_bg_colour?: string
  scrolled_theme: 'dark' | 'light'
  logo_scrolled?: { url: string }
  cta_label?: string
  cta_link?: LinkType
  nav_items: LinkType[]
}

export type HeroHeaderSection = {
  __component: 'sections.hero-header'
  name: string
  header_type: 'hero' | 'standard'
  carousel_speed: 'on_click' | 'slow' | 'fast'
  content_alignment: 'left' | 'centre' | 'right'
  vertical_alignment: 'top' | 'middle' | 'bottom'
  items: HeroItemType[]
  link_bar: boolean
  link_bar_bg?: string
  link_bar_items: LinkBarItemType[]
}

export type ContentBlockSection = {
  __component: 'sections.content-block'
  name: string
  title?: string
  subtitle?: string
  link?: LinkType
  title_alignment: 'left' | 'centre' | 'right'
  background: 'colour' | 'image'
  bg_colour?: string
  bg_image?: { url: string }
  theme: 'light' | 'dark'
  style: 'card' | 'tile' | 'media_text'
  media_alignment: 'left' | 'right'
  columns: '1' | '2' | '3' | '4'
  layout: 'stack' | 'scroll' | 'carousel'
  articles?: ArticleType[]
}

export type ObjectBlockSection = {
  __component: 'sections.object-block'
  name: string
  title?: string
  subtitle?: string
  link?: LinkType
  title_alignment: 'left' | 'centre' | 'right'
  background: 'colour' | 'image'
  bg_colour?: string
  theme: 'light' | 'dark'
  columns: '1' | '2' | '3' | '4'
  layout: 'stack' | 'scroll' | 'carousel'
  articles?: ArticleType[]
}

export type FooterBlockSection = {
  __component: 'sections.footer-block'
  name: string
  logo?: { url: string }
  copyright_text?: string
  acknowledgement_of_country?: string
  nav_columns: FooterColumnType[]
  legal_links: LinkType[]
}

export type PageSection =
  | SiteNavSection
  | HeroHeaderSection
  | ContentBlockSection
  | ObjectBlockSection
  | FooterBlockSection

export type PageType = {
  id: number
  title: string
  slug: string
  seo_title?: string
  seo_description?: string
  sections: PageSection[]
}
