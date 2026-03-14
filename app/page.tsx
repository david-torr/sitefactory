import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroHeader from "@/components/sections/HeroHeader";
import ContentBlock from "@/components/sections/ContentBlock";
import ObjectBlock from "@/components/sections/ObjectBlock";
import tokens from "@/tokens/tokens.json";

// ─── Logos ────────────────────────────────────────────────────────────────────

const HeaderLogo = (
  <span
    style={{
      fontFamily: tokens.typography.fontFamily.sans,
      fontSize: tokens.typography.fontSize["2xl"],
      fontWeight: tokens.typography.fontWeight.bold,
      letterSpacing: tokens.typography.letterSpacing.tight,
      color: tokens.color.brand.primary,
    }}
  >
    Forma
  </span>
);

const FooterLogo = (
  <span
    style={{
      fontFamily: tokens.typography.fontFamily.sans,
      fontSize: tokens.typography.fontSize["2xl"],
      fontWeight: tokens.typography.fontWeight.bold,
      letterSpacing: tokens.typography.letterSpacing.tight,
      color: tokens.color.neutral[100],
    }}
  >
    Forma
  </span>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* 1. Header */}
      <Header
        logo={HeaderLogo}
        navLinks={[
          { label: "Solutions", href: "#solutions" },
          { label: "Work", href: "#work" },
          { label: "About", href: "#about" },
          { label: "Blog", href: "#blog" },
        ]}
        ctaLabel="Get started"
        ctaHref="#contact"
      />

      <main>
        {/* 2. HeroHeader */}
        <HeroHeader
          name="home-hero"
          carouselSpeed={5000}
          contentAlignment="left"
          verticalAlignment="middle"
          linkBarVisible={true}
          linkBarBgColour={tokens.color.neutral[100]}
          heroItems={[
            {
              name: "slide-design",
              title: "Design beyond expectation.",
              subtitle:
                "We partner with ambitious brands to create digital experiences that define categories and move markets.",
              button1Label: "See our work",
              button1Link: { label: "See our work", url: "#work" },
              button2Label: "Talk to us",
              button2Link: { label: "Talk to us", url: "#contact" },
              theme: "dark",
              bgColour: tokens.color.neutral[900],
              contentAlignment: "left",
            },
            {
              name: "slide-engineering",
              title: "Built for performance at scale.",
              subtitle:
                "From early-stage startups to global enterprises, we bring precision engineering to every product we ship.",
              button1Label: "Our approach",
              button1Link: { label: "Our approach", url: "#about" },
              theme: "dark",
              bgColour: tokens.color.neutral[800],
              contentAlignment: "left",
            },
            {
              name: "slide-strategy",
              title: "Where craft meets strategy.",
              subtitle:
                "The best products live at the intersection of beautiful design and rigorous, evidence-based thinking.",
              button1Label: "Start a project",
              button1Link: { label: "Start a project", url: "#contact" },
              button2Label: "View case studies",
              button2Link: { label: "View case studies", url: "#work" },
              theme: "dark",
              bgColour: "#1a1a1a",
              contentAlignment: "left",
            },
          ]}
          linkBarItems={[
            {
              title: "Brand Identity",
              subtitle: "Positioning, identity & design systems",
            },
            {
              title: "Web & Product",
              subtitle: "Next.js, React & mobile applications",
            },
            {
              title: "Growth Strategy",
              subtitle: "Analytics, SEO & performance marketing",
            },
          ]}
        />

        {/* 3. ContentBlock — Selected work */}
        <section id="work">
          <ContentBlock
            name="selected-work"
            title="Selected work"
            subtitle="Recent projects across brand, digital, and product strategy."
            titleAlignment="left"
            backgroundColour={tokens.color.neutral[50]}
            theme="light"
            style="card"
            layout="grid"
            columns={3}
            link={{ label: "View all projects", url: "#" }}
            items={[
              {
                name: "apex-rebrand",
                title: "Apex Financial — Brand Overhaul",
                blurb:
                  "Complete brand refresh for a Series B fintech: new identity, design system, and marketing site that drove a 40% increase in enterprise sign-ups.",
                image: {
                  url: "https://picsum.photos/seed/apex-fin/800/520",
                  alternativeText: "Apex Financial brand project",
                },
                alignment: "left",
                primaryLink: { label: "View case study", url: "#" },
              },
              {
                name: "orbit-platform",
                title: "Orbit — Logistics Platform",
                blurb:
                  "End-to-end design and engineering for a real-time logistics dashboard serving 200+ fleet operators across Europe.",
                image: {
                  url: "https://picsum.photos/seed/orbit-log/800/520",
                  alternativeText: "Orbit logistics platform",
                },
                alignment: "left",
                primaryLink: { label: "View case study", url: "#" },
              },
              {
                name: "vessel-studio",
                title: "Vessel — Luxury E-commerce",
                blurb:
                  "Custom Shopify storefront and editorial content strategy for a premium homewares brand entering the US market.",
                image: {
                  url: "https://picsum.photos/seed/vessel-lux/800/520",
                  alternativeText: "Vessel Studio e-commerce",
                },
                alignment: "left",
                primaryLink: { label: "View case study", url: "#" },
              },
            ]}
          />
        </section>

        {/* 4. ObjectBlock — Services */}
        <section id="solutions">
          <ObjectBlock
            name="services"
            title="What we do"
            subtitle="End-to-end capabilities across the full digital product lifecycle."
            titleAlignment="center"
            theme="dark"
            backgroundColour={tokens.color.neutral[900]}
            columns={3}
            layout="grid"
            items={[
              {
                name: "brand-strategy",
                title: "Brand Strategy",
                blurb:
                  "Define your market position, tone of voice, and visual identity with a cohesive brand system built to scale.",
              },
              {
                name: "product-design",
                title: "Product Design",
                blurb:
                  "User research, interaction design, prototyping, and design systems that put people at the centre of every decision.",
              },
              {
                name: "web-development",
                title: "Web Development",
                blurb:
                  "High-performance Next.js applications with clean architecture, accessibility built in, and optimised for Core Web Vitals.",
              },
              {
                name: "content-strategy",
                title: "Content Strategy",
                blurb:
                  "Purposeful content frameworks that attract the right audience, communicate your value, and drive meaningful action.",
              },
              {
                name: "growth-marketing",
                title: "Growth Marketing",
                blurb:
                  "Data-driven acquisition and retention programmes across paid, organic, and lifecycle channels.",
              },
              {
                name: "analytics",
                title: "Analytics & Insights",
                blurb:
                  "Measurement infrastructure, dashboards, and regular reporting so you always know what's working and why.",
              },
            ]}
          />
        </section>
      </main>

      {/* 5. Footer */}
      <Footer
        logo={FooterLogo}
        tagline="Building what's next for ambitious brands."
        copyrightName="Forma Studio Ltd"
        linkGroups={[
          {
            heading: "Work",
            links: [
              { label: "Case Studies", href: "#work" },
              { label: "Our Process", href: "#about" },
              { label: "Results", href: "#" },
              { label: "Testimonials", href: "#" },
            ],
          },
          {
            heading: "Studio",
            links: [
              { label: "About", href: "#about" },
              { label: "Team", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Press", href: "#" },
            ],
          },
          {
            heading: "Connect",
            links: [
              { label: "Blog", href: "#" },
              { label: "Newsletter", href: "#" },
              { label: "Contact", href: "#contact" },
              { label: "LinkedIn", href: "#" },
            ],
          },
        ]}
        legalLinks={[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
          { label: "Cookies", href: "#" },
        ]}
      />
    </>
  );
}
