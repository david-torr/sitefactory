// Site Factory — Variables Plugin
// Creates "Primitives" and "Theme" variable collections, text styles,
// and targeted fill bindings for the design system.

try {
  // ── Helpers ──────────────────────────────────────────────────────────

  /** Delete any existing collection that matches the given name. */
  function deleteCollectionByName(name) {
    for (const c of figma.variables.getLocalVariableCollections()) {
      if (c.name === name) c.remove();
    }
  }

  /** Find all descendant nodes with a given name. */
  function findNodesNamed(name, root) {
    const results = [];
    function walk(node) {
      if (node.name === name) results.push(node);
      if ("children" in node) node.children.forEach(walk);
    }
    walk(root);
    return results;
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
    "brand-default":    { r: 0,     g: 0,     b: 0,     a: 1 },  // swapped per client
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

  // Map to look up theme variables by name (used for targeted bindings)
  const themeVarsByName = {};

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
    themeVarsByName[name] = v;
  }

  // ── Theme color aliases ─────────────────────────────────────────────

  const themeColorAliases = {
    "color/background":       "white",
    "color/surface":          "neutral-50",
    "color/surface-alt":      "neutral-100",
    "color/surface-inverse":  "neutral-900",
    "color/surface-raised":   "neutral-800",
    "color/border":           "neutral-200",
    "color/text-primary":     "neutral-900",
    "color/text-secondary":   "neutral-500",
    "color/text-inverse":     "white",
    "color/text-disabled":    "neutral-400",
    "color/brand-primary":    "brand-default",   // ← brand, not black
    "color/brand-secondary":  "white",
    "color/brand-accent":     "brand-default",   // ← brand, not black
    "color/btn-bg":           "brand-default",   // ← brand, not black
    "color/btn-text":         "white",
    "color/btn-bg-outline":   "white",
    "color/btn-text-outline": "neutral-900",
    "color/nav-bg":           "white",
    "color/hero-bg":          "neutral-900",
    "color/ticker-bg":        "neutral-100",
    "color/card-bg-dark":     "neutral-800",
    "color/footer-bg":        "neutral-900",
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

  // ── TEXT STYLES — type scale ────────────────────────────────────────

  const textStyleDefs = [
    { name: "Display/H1",  size: 60, style: "Bold",     lineHeight: 66,  letterSpacing: -1.5 },
    { name: "Display/H2",  size: 40, style: "Bold",     lineHeight: 48,  letterSpacing: -0.8 },
    { name: "Display/H3",  size: 28, style: "Bold",     lineHeight: 36,  letterSpacing: -0.3 },
    { name: "Body/Large",  size: 18, style: "Regular",  lineHeight: 28,  letterSpacing: 0 },
    { name: "Body/Base",   size: 16, style: "Regular",  lineHeight: 24,  letterSpacing: 0 },
    { name: "Body/Small",  size: 14, style: "Regular",  lineHeight: 20,  letterSpacing: 0 },
    { name: "UI/Label",    size: 14, style: "SemiBold", lineHeight: 20,  letterSpacing: 0.35 },
    { name: "UI/Caption",  size: 11, style: "SemiBold", lineHeight: 16,  letterSpacing: 1.1 },
    { name: "UI/Nav",      size: 14, style: "Regular",  lineHeight: 20,  letterSpacing: 0 },
  ];

  // Font loading is async — wrap in an async IIFE
  (async () => {
    try {
      // Collect unique font variants to load
      const uniqueStyles = [...new Set(textStyleDefs.map(d => d.style))];
      for (const s of uniqueStyles) {
        await figma.loadFontAsync({ family: "DM Sans", style: s });
      }

      // Create text styles
      for (const def of textStyleDefs) {
        // Remove existing style with same name
        const existing = figma.getLocalTextStyles().find(s => s.name === def.name);
        if (existing) existing.remove();

        const ts = figma.createTextStyle();
        ts.name = def.name;
        ts.fontSize = def.size;
        ts.fontName = { family: "DM Sans", style: def.style };
        ts.lineHeight = { unit: "PIXELS", value: def.lineHeight };
        ts.letterSpacing = { unit: "PERCENT", value: def.letterSpacing };
      }

      // ── TARGETED FILL BINDINGS ────────────────────────────────────

      const btnBgVar = themeVarsByName["color/btn-bg"];
      const btnTextVar = themeVarsByName["color/btn-text"];
      const cardBgDarkVar = themeVarsByName["color/card-bg-dark"];

      // "Link" nodes with black fill → bind to btn-bg, text children to btn-text
      if (btnBgVar && btnTextVar) {
        const linkNodes = findNodesNamed("Link", figma.currentPage);
        for (const node of linkNodes) {
          if ("fills" in node) {
            node.setBoundVariable("fills", 0, btnBgVar);
          }
          if ("children" in node) {
            for (const child of node.children) {
              if (child.type === "TEXT") {
                child.setBoundVariable("fills", 0, btnTextVar);
              }
            }
          }
        }
      }

      // "Background" nodes inside "Object Block" → bind to card-bg-dark
      if (cardBgDarkVar) {
        const objectBlocks = findNodesNamed("Object Block", figma.currentPage);
        for (const block of objectBlocks) {
          const bgNodes = findNodesNamed("Background", block);
          for (const bg of bgNodes) {
            if ("fills" in bg) {
              bg.setBoundVariable("fills", 0, cardBgDarkVar);
            }
          }
        }
      }

      figma.notify("✅ Variables, text styles & targeted bindings ready");
    } catch (err) {
      figma.notify("❌ Error in async section: " + err.message, { error: true });
      console.error(err);
    }

    figma.closePlugin();
  })();

} catch (err) {
  figma.notify("❌ Plugin error: " + err.message, { error: true });
  console.error(err);
  figma.closePlugin();
}
