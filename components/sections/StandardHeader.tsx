import tokens from "@/tokens/tokens.json";
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
      className="w-full animate-pulse px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: tokens.color.neutral[200] }}
      aria-busy="true"
      aria-label="Loading header"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div
          className="h-11 w-2/3 rounded-md"
          style={{ backgroundColor: tokens.color.neutral[300] }}
        />
        <div
          className="h-5 w-full rounded"
          style={{ backgroundColor: tokens.color.neutral[300] }}
        />
        <div
          className="h-5 w-4/5 rounded"
          style={{ backgroundColor: tokens.color.neutral[300] }}
        />
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
  const textPrimary = isDark || hasImage ? tokens.color.neutral[100] : tokens.color.neutral[900];
  const textSecondary =
    isDark || hasImage ? tokens.color.neutral[300] : tokens.color.neutral[600];
  const defaultBg = isDark ? tokens.color.neutral[900] : tokens.color.neutral[100];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ fontFamily: tokens.typography.fontFamily.sans }}
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
              background: isDark
                ? "rgba(0,0,0,0.60)"
                : "rgba(255,255,255,0.55)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div
        className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        style={!hasImage ? { backgroundColor: bgColour ?? defaultBg } : undefined}
      >
        <div
          className={`max-w-3xl ${textAlignClass[contentAlignment]} ${maxWidthAlignClass[contentAlignment]}`}
        >
          <h1
            className="sm:text-5xl"
            style={{
              color: textPrimary,
              fontSize: tokens.typography.fontSize["4xl"],
              fontWeight: tokens.typography.fontWeight.bold,
              lineHeight: tokens.typography.lineHeight.tight,
              letterSpacing: tokens.typography.letterSpacing.tight,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              style={{
                color: textSecondary,
                fontSize: tokens.typography.fontSize.lg,
                lineHeight: tokens.typography.lineHeight.relaxed,
                marginTop: tokens.spacing[5],
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
