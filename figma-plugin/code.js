// Site Factory — Variables Plugin
// Creates "Primitives" and "Theme" variable collections for the design system.

try {
  // ── Helpers ──────────────────────────────────────────────────────────

  /** Delete any existing collection that matches the given name. */
  function deleteCollectionByName(name) {
    for (const c of figma.variables.getLocalVariableCollections()) {
      if (c.name === name) c.remove();
    }
  }

  // ── Clean slate ─────────────────────────────────────────────────────

  deleteCollectionByName("Primitives");
  deleteCollectionByName("Theme");

  // ── COLLECTION 1: Primitives ────────────────────────────────────────

  const primitivesCollection = figma.variables.createVariableCollection("Primitives");
  const primitivesMode = primitivesCollection.modes[0].modeId;
  primitivesCollection.renameMode(primitivesMode, "Value");

  // Map to look up primitive variables by name (used later for aliases)
  const primitiveVarsByName = {};

  /** Create a primitive variable, set its value, and register it. */
  function addPrimitive(name, resolvedType, value) {
    const v = figma.variables.createVariable(name, primitivesCollection, resolvedType);
    v.setValueForMode(primitivesMode, value);
    primitiveVarsByName[name] = v;
  }

  // ── Primitive colors ────────────────────────────────────────────────

  const primitiveColors = {
    "black":            { r: 0,     g: 0,     b: 0,     a: 1 },
    "white":            { r: 1,     g: 1,     b: 1,     a: 1 },
    "neutral-50":       { r: 0.980, g: 0.980, b: 0.980, a: 1 },
    "neutral-100":      { r: 0.961, g: 0.961, b: 0.961, a: 1 },
    "neutral-200":      { r: 0.898, g: 0.898, b: 0.898, a: 1 },
    "neutral-300":      { r: 0.831, g: 0.831, b: 0.831, a: 1 },
    "neutral-400":      { r: 0.639, g: 0.639, b: 0.639, a: 1 },
    "neutral-500":      { r: 0.451, g: 0.451, b: 0.451, a: 1 },
    "neutral-600":      { r: 0.322, g: 0.322, b: 0.322, a: 1 },
    "neutral-700":      { r: 0.251, g: 0.251, b: 0.251, a: 1 },
    "neutral-800":      { r: 0.149, g: 0.149, b: 0.149, a: 1 },
    "neutral-900":      { r: 0.090, g: 0.090, b: 0.090, a: 1 },
    "feedback-success": { r: 0.086, g: 0.639, b: 0.290, a: 1 },
    "feedback-warning": { r: 0.851, g: 0.467, b: 0.024, a: 1 },
    "feedback-error":   { r: 0.863, g: 0.149, b: 0.149, a: 1 },
    "feedback-info":    { r: 0.145, g: 0.388, b: 0.922, a: 1 },
  };

  for (const [name, rgba] of Object.entries(primitiveColors)) {
    addPrimitive(name, "COLOR", rgba);
  }

  // ── Primitive fonts (STRING) ────────────────────────────────────────

  const primitiveFonts = {
    "font-display": "DM Sans",
    "font-body":    "DM Sans",
    "font-mono":    "ui-monospace, monospace",
  };

  for (const [name, value] of Object.entries(primitiveFonts)) {
    addPrimitive(name, "STRING", value);
  }

  // ── Primitive spacing (NUMBER) ──────────────────────────────────────

  const primitiveSpacing = {
    "space-1": 4,   "space-2": 8,   "space-3": 12,  "space-4": 16,
    "space-5": 20,  "space-6": 24,  "space-8": 32,  "space-10": 40,
    "space-12": 48, "space-16": 64, "space-20": 80,  "space-24": 96,
  };

  for (const [name, value] of Object.entries(primitiveSpacing)) {
    addPrimitive(name, "FLOAT", value);
  }

  // ── Primitive radius (NUMBER) ───────────────────────────────────────

  const primitiveRadius = {
    "radius-none": 0,    "radius-sm": 2,     "radius-base": 4,
    "radius-md": 6,      "radius-lg": 8,     "radius-xl": 12,
    "radius-2xl": 16,    "radius-full": 9999,
  };

  for (const [name, value] of Object.entries(primitiveRadius)) {
    addPrimitive(name, "FLOAT", value);
  }

  // ── COLLECTION 2: Theme ─────────────────────────────────────────────

  const themeCollection = figma.variables.createVariableCollection("Theme");
  const themeMode = themeCollection.modes[0].modeId;
  themeCollection.renameMode(themeMode, "Default");

  /** Create a Theme variable that aliases a Primitives variable. */
  function addThemeAlias(name, resolvedType, primitiveName) {
    const target = primitiveVarsByName[primitiveName];
    if (!target) {
      figma.notify(`⚠️ Primitive "${primitiveName}" not found for alias "${name}"`);
      return;
    }
    const v = figma.variables.createVariable(name, themeCollection, resolvedType);
    v.setValueForMode(themeMode, {
      type: "VARIABLE_ALIAS",
      id: target.id,
    });
  }

  // ── Theme color aliases ─────────────────────────────────────────────

  const themeColorAliases = {
    "color/background":      "white",
    "color/surface":         "neutral-50",
    "color/surface-alt":     "neutral-100",
    "color/surface-inverse": "neutral-900",
    "color/surface-raised":  "neutral-800",
    "color/border":          "neutral-200",
    "color/text-primary":    "neutral-900",
    "color/text-secondary":  "neutral-500",
    "color/text-inverse":    "white",
    "color/text-disabled":   "neutral-400",
    "color/brand-primary":   "black",
    "color/brand-secondary": "white",
    "color/brand-accent":    "black",
    "color/btn-bg":          "black",
    "color/btn-text":        "white",
    "color/btn-bg-outline":  "white",
    "color/btn-text-outline": "neutral-900",
    "color/nav-bg":          "white",
    "color/hero-bg":         "neutral-900",
    "color/ticker-bg":       "neutral-100",
    "color/card-bg-dark":    "neutral-800",
    "color/footer-bg":       "neutral-900",
  };

  for (const [name, primitiveName] of Object.entries(themeColorAliases)) {
    addThemeAlias(name, "COLOR", primitiveName);
  }

  // ── Theme radius aliases ────────────────────────────────────────────

  const themeRadiusAliases = {
    "radius/button":    "radius-md",
    "radius/card":      "radius-lg",
    "radius/card-dark": "radius-xl",
  };

  for (const [name, primitiveName] of Object.entries(themeRadiusAliases)) {
    addThemeAlias(name, "FLOAT", primitiveName);
  }

  // ── Done ────────────────────────────────────────────────────────────

  figma.notify("✅ Variables created — Primitives & Theme collections ready");

} catch (err) {
  figma.notify("❌ Plugin error: " + err.message, { error: true });
  console.error(err);
}

figma.closePlugin();
