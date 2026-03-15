import type { StrapiMedia } from "./types";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface StandardHeaderProps {
  name: string;
  theme?: "light" | "dark";
  backgroundType?: "colour" | "image";
  bgColour?: string;
  bgImage?: StrapiMedia;
  title?: string;
  subtitle?: string;
  contentAlignment?: "left" | "center" | "right";
}

// ─── Alignment helpers ────────────────────────────────────────────────────────

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

function StandardHeaderSkeleton() {
  return (
    <div
      className="w-full animate-pulse bg-neutral-200 px-4 py-20 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading header"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="h-11 w-2/3 rounded-md bg-neutral-300" />
        <div className="h-5 w-full rounded bg-neutral-300" />
        <div className="h-5 w-4/5 rounded bg-neutral-300" />
      </div>
    </div>
  );
}

// ─── StandardHeader ───────────────────────────────────────────────────────────

export default function StandardHeader({
  theme = "light",
  backgroundType = "colour",
  bgColour,
  bgImage,
  title,
  subtitle,
  contentAlignment = "left",
}: StandardHeaderProps) {
  if (!title) return <StandardHeaderSkeleton />;

  const isDark = theme === "dark";
  const hasImage = backgroundType === "image" && !!bgImage?.url;

  // When rendering over an image, always use light-on-dark text
  const isLight = !isDark && !hasImage;
  const titleClass = isLight ? "text-primary" : "text-neutral-100";
  const subtitleClass = isLight ? "text-neutral-600" : "text-neutral-300";
  const defaultBgClass = isDark ? "bg-neutral-900" : "bg-neutral-100";

  return (
    <section
      className="relative w-full overflow-hidden font-body"
      aria-label={title}
    >
      {/* Background image layer */}
      {hasImage && (
        <>
          <img
            src={bgImage!.url}
            alt={bgImage!.alternativeText ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {/* Scrim so text is always legible */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.55)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div
        className={`relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${
          !hasImage ? defaultBgClass : ""
        }`}
        style={!hasImage && bgColour ? { backgroundColor: bgColour } : undefined}
      >
        <div
          className={`max-w-3xl ${textAlignClass[contentAlignment]} ${maxWidthAlignClass[contentAlignment]}`}
        >
          <h1
            className={`font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl ${titleClass}`}
          >
            {title}
          </h1>

          {subtitle && (
            <p className={`mt-5 font-body text-lg leading-relaxed ${subtitleClass}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
