// Site Factory — Create Components Plugin
// Creates component sets with variants for Nav, Hero, Content Block, Object Block, Footer.

(async () => {
  try {
    // ── Font loading ──────────────────────────────────────────────────
    await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
    await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
    await figma.loadFontAsync({ family: "DM Sans", style: "SemiBold" });
    await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });

    // ── Colour palette ────────────────────────────────────────────────
    const C = {
      black: { r: 0, g: 0, b: 0 },
      white: { r: 1, g: 1, b: 1 },
      n50:   { r: 0.980, g: 0.980, b: 0.980 },
      n100:  { r: 0.961, g: 0.961, b: 0.961 },
      n200:  { r: 0.898, g: 0.898, b: 0.898 },
      n300:  { r: 0.831, g: 0.831, b: 0.831 },
      n400:  { r: 0.639, g: 0.639, b: 0.639 },
      n500:  { r: 0.451, g: 0.451, b: 0.451 },
      n600:  { r: 0.322, g: 0.322, b: 0.322 },
      n700:  { r: 0.251, g: 0.251, b: 0.251 },
      n800:  { r: 0.149, g: 0.149, b: 0.149 },
      n900:  { r: 0.090, g: 0.090, b: 0.090 },
    };

    const PAD = 80;           // horizontal page padding
    const CONTENT_W = 1280;   // 1440 - 80*2
    const GAP = 24;           // gap between cards
    let currentY = 0;

    // ── Helpers ───────────────────────────────────────────────────────

    function applyFill(node, color, opacity) {
      node.fills = [{ type: "SOLID", color, opacity: opacity ?? 1 }];
    }

    function txt(content, size, style, color, opacity) {
      const t = figma.createText();
      t.fontName = { family: "DM Sans", style };
      t.characters = content;
      t.fontSize = size;
      applyFill(t, color, opacity);
      return t;
    }

    function rect(w, h, color, opacity) {
      const r = figma.createRectangle();
      r.resize(w, h);
      if (color) applyFill(r, color, opacity);
      return r;
    }

    function comp(name, w, h) {
      const c = figma.createComponent();
      c.name = name;
      c.resize(w, h);
      return c;
    }

    function add(parent, child, x, y) {
      parent.appendChild(child);
      child.x = x;
      child.y = y;
      return child;
    }

    function placeSet(set) {
      set.x = 100;
      set.y = currentY;
      currentY += set.height + 120;
    }

    function colW(cols) {
      return (CONTENT_W - (cols - 1) * GAP) / cols;
    }

    /** Wrapped text block — fixed width, auto height. */
    function wrappedText(content, size, style, color, w, opacity) {
      const t = txt(content, size, style, color, opacity);
      t.textAutoResize = "HEIGHT";
      t.resize(w, t.height);
      return t;
    }

    /** Section header: title 30px Bold + subtitle 16px Regular. Returns next Y. */
    function addHeader(parent, y, titleCol, subCol, centered) {
      const title = txt("Section Title", 30, "Bold", titleCol);
      const sub = txt("Section subtitle goes here.", 16, "Regular", subCol);
      if (centered) {
        title.textAlignHorizontal = "CENTER";
        title.textAutoResize = "HEIGHT";
        title.resize(CONTENT_W, title.height);
        sub.textAlignHorizontal = "CENTER";
        sub.textAutoResize = "HEIGHT";
        sub.resize(CONTENT_W, sub.height);
      }
      add(parent, title, PAD, y);
      add(parent, sub, PAD, y + 40);
      return y + 80;
    }

    // ══════════════════════════════════════════════════════════════════
    // COMPONENT SET 1: Nav
    // ══════════════════════════════════════════════════════════════════

    function createNav(name, o) {
      const c = comp(name, 1440, 64);
      add(c, rect(1440, 64, o.bg, o.bgOp), 0, 0);
      if (o.border) add(c, rect(1440, 1, o.border), 0, 63);

      // Logo
      const logo = rect(28, 28, o.logo);
      logo.cornerRadius = 4;
      add(c, logo, 80, 18);
      add(c, txt("Brand Name", 16, "Bold", o.logoTxt), 116, 21);

      // Links
      let lx = 580;
      for (const l of ["Link 1", "Link 2", "Link 3"]) {
        add(c, txt(l, 14, "Regular", o.link, o.linkOp), lx, 23);
        lx += 80;
      }

      // CTA
      const bx = 1270, by = 16, bw = 90, bh = 32;
      if (o.ctaOutline) {
        const bg = rect(bw, bh, C.white, 0);
        bg.cornerRadius = 6;
        bg.fills = [];
        bg.strokes = [{ type: "SOLID", color: o.ctaStroke }];
        bg.strokeWeight = 1;
        add(c, bg, bx, by);
      } else {
        const bg = rect(bw, bh, o.ctaBg);
        bg.cornerRadius = 6;
        add(c, bg, bx, by);
      }
      add(c, txt("Account", 13, "SemiBold", o.ctaTxt), bx + 16, by + 8);
      return c;
    }

    const navSet = figma.combineAsVariants([
      createNav("Mode=Solid, Theme=Light", {
        bg: C.white, border: C.n200,
        logo: C.n900, logoTxt: C.n900, link: C.n900,
        ctaBg: C.n900, ctaTxt: C.white,
      }),
      createNav("Mode=Solid, Theme=Dark", {
        bg: C.n900,
        logo: C.white, logoTxt: C.white, link: C.white, linkOp: 0.85,
        ctaBg: C.white, ctaTxt: C.n900,
      }),
      createNav("Mode=Overlay, Theme=Dark", {
        bg: C.n900, bgOp: 0.4,
        logo: C.white, logoTxt: C.white, link: C.white, linkOp: 0.85,
        ctaOutline: true, ctaStroke: C.white, ctaTxt: C.white,
      }),
      createNav("Mode=Overlay, Theme=Light", {
        bg: C.white, bgOp: 0.4,
        logo: C.n900, logoTxt: C.n900, link: C.n900,
        ctaOutline: true, ctaStroke: C.n900, ctaTxt: C.n900,
      }),
    ], figma.currentPage);
    navSet.name = "Nav";
    placeSet(navSet);

    // ══════════════════════════════════════════════════════════════════
    // COMPONENT SET 2: Hero
    // ══════════════════════════════════════════════════════════════════

    function createHero(name, o) {
      const c = comp(name, 1440, 560);
      add(c, rect(1440, 560, o.bg), 0, 0);

      const cx = o.ctr ? 400 : 80;
      const cw = 640;
      const cy = 180;

      // Heading
      const h1 = txt("Section Heading", 52, "Bold", o.h1);
      if (o.ctr) {
        h1.textAlignHorizontal = "CENTER";
        h1.textAutoResize = "HEIGHT";
        h1.resize(cw, h1.height);
      }
      add(c, h1, cx, cy);

      // Subtext
      const p = txt("A short description of this section that supports the heading above.", 18, "Regular", o.p, o.pOp);
      if (o.ctr) {
        p.textAlignHorizontal = "CENTER";
        p.textAutoResize = "HEIGHT";
        p.resize(cw, p.height);
      }
      add(c, p, cx, cy + 70);

      // CTAs
      const by = cy + 130;
      const b1x = o.ctr ? 520 : cx;
      const btn1 = rect(140, 44, o.cta1Bg);
      btn1.cornerRadius = 6;
      add(c, btn1, b1x, by);
      add(c, txt("Get Started", 14, "SemiBold", o.cta1Txt), b1x + 28, by + 13);

      const b2x = b1x + 160;
      const btn2 = rect(120, 44, C.white, 0);
      btn2.cornerRadius = 6;
      btn2.fills = [];
      btn2.strokes = [{ type: "SOLID", color: o.cta2Border }];
      btn2.strokeWeight = 1;
      add(c, btn2, b2x, by);
      add(c, txt("Learn More", 14, "SemiBold", o.cta2Txt), b2x + 20, by + 13);

      // Carousel dots
      const dy = 510;
      const pill = rect(24, 8, o.h1);
      pill.cornerRadius = 4;
      add(c, pill, 690, dy);
      for (let i = 0; i < 2; i++) {
        const dot = rect(8, 8, o.h1, 0.3);
        dot.cornerRadius = 4;
        add(c, dot, 722 + i * 16, dy);
      }
      return c;
    }

    const heroSet = figma.combineAsVariants([
      createHero("Position=Left, Theme=Dark", {
        bg: C.n900, h1: C.white, p: C.white, pOp: 0.65,
        cta1Bg: C.white, cta1Txt: C.n900, cta2Border: C.white, cta2Txt: C.white,
      }),
      createHero("Position=Centre, Theme=Dark", {
        bg: C.n900, h1: C.white, p: C.white, pOp: 0.65, ctr: true,
        cta1Bg: C.white, cta1Txt: C.n900, cta2Border: C.white, cta2Txt: C.white,
      }),
      createHero("Position=Left, Theme=Light", {
        bg: C.n50, h1: C.n900, p: C.n500,
        cta1Bg: C.n900, cta1Txt: C.white, cta2Border: C.n900, cta2Txt: C.n900,
      }),
      createHero("Position=Centre, Theme=Light", {
        bg: C.n50, h1: C.n900, p: C.n500, ctr: true,
        cta1Bg: C.n900, cta1Txt: C.white, cta2Border: C.n900, cta2Txt: C.n900,
      }),
    ], figma.currentPage);
    heroSet.name = "Hero";
    placeSet(heroSet);

    // ══════════════════════════════════════════════════════════════════
    // COMPONENT SET 3: Content Block
    // ══════════════════════════════════════════════════════════════════

    /** Standard card with image/title/body/CTA. Returns card height. */
    function addCard(parent, x, y, w, o) {
      const cardH = o.imgH + 200;
      const bg = rect(w, cardH, o.cardBg);
      bg.cornerRadius = 8;
      add(parent, bg, x, y);

      // Image placeholder (round top corners only)
      const img = rect(w, o.imgH, o.imgBg);
      img.topLeftRadius = 8;
      img.topRightRadius = 8;
      add(parent, img, x, y);

      add(parent, txt("Card Title", 16, "SemiBold", o.title), x + 16, y + o.imgH + 16);
      add(parent, wrappedText("Brief description of this card content goes here.", 13, "Regular", o.body, w - 32), x + 16, y + o.imgH + 44);

      const btn = rect(80, 28, o.btnBg);
      btn.cornerRadius = 6;
      add(parent, btn, x + 16, y + o.imgH + 90);
      add(parent, txt("Action", 12, "SemiBold", o.btnTxt), x + 28, y + o.imgH + 97);
      return cardH;
    }

    // Light card defaults
    const CARD_L = { imgH: 160, cardBg: C.white, imgBg: C.n200, title: C.n900, body: C.n500, btnBg: C.n900, btnTxt: C.white };
    const CARD_D = { imgH: 160, cardBg: C.n800, imgBg: C.n700, title: C.white, body: C.n400, btnBg: C.white, btnTxt: C.n900 };

    // V1: Card / Grid / Light / 3
    function cbV1() {
      const h = 560;
      const c = comp("Style=Card, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      const ny = addHeader(c, 64, C.n900, C.n500);
      const w = colW(3);
      for (let i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_L);
      return c;
    }

    // V2: Card / Grid / Dark / 3
    function cbV2() {
      const h = 560;
      const c = comp("Style=Card, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      const ny = addHeader(c, 64, C.white, C.n400);
      const w = colW(3);
      for (let i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_D);
      return c;
    }

    // V3: Card / Grid / Light / 2
    function cbV3() {
      const h = 560;
      const c = comp("Style=Card, Layout=Grid, Theme=Light, Columns=2", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      const ny = addHeader(c, 64, C.n900, C.n500);
      const w = colW(2);
      for (let i = 0; i < 2; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_L);
      return c;
    }

    // V4: Card / Featured / Light / 3
    function cbV4() {
      const h = 720;
      const c = comp("Style=Card, Layout=Featured, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      const ny = addHeader(c, 64, C.n900, C.n500);

      // Featured card — full width, split image + text
      const fy = ny + 40;
      const fH = 280;
      const fb = rect(CONTENT_W, fH, C.white);
      fb.cornerRadius = 8;
      add(c, fb, PAD, fy);

      const fImg = rect(CONTENT_W / 2, fH, C.n300);
      fImg.topLeftRadius = 8;
      fImg.bottomLeftRadius = 8;
      add(c, fImg, PAD, fy);

      const ftx = PAD + CONTENT_W / 2 + 32;
      add(c, txt("Featured Title", 28, "Bold", C.n900), ftx, fy + 40);
      add(c, wrappedText("A longer description for the featured content card that provides more detail.", 16, "Regular", C.n500, CONTENT_W / 2 - 80), ftx, fy + 80);
      const fbtn = rect(100, 36, C.n900);
      fbtn.cornerRadius = 6;
      add(c, fbtn, ftx, fy + 140);
      add(c, txt("Action", 13, "SemiBold", C.white), ftx + 28, fy + 150);

      // 3 smaller cards below
      const sy = fy + fH + 24;
      const w = colW(3);
      for (let i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), sy, w, { ...CARD_L, imgH: 120 });
      return c;
    }

    // V5: List / Grid / Light / 3
    function cbV5() {
      const h = 480;
      const c = comp("Style=List, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.white), 0, 0);
      const ny = addHeader(c, 64, C.n900, C.n500);

      for (let i = 0; i < 3; i++) {
        const ry = ny + 40 + i * 81;
        const img = rect(80, 80, C.n200);
        img.cornerRadius = 8;
        add(c, img, PAD, ry);
        add(c, txt("List Item Title", 16, "SemiBold", C.n900), PAD + 100, ry + 12);
        add(c, txt("Brief description of this list item.", 13, "Regular", C.n500), PAD + 100, ry + 36);
        add(c, txt("View \u2192", 13, "SemiBold", C.n900), 1280, ry + 30);
        if (i < 2) add(c, rect(CONTENT_W, 1, C.n200), PAD, ry + 80);
      }
      return c;
    }

    // V6: List / Grid / Dark / 3
    function cbV6() {
      const h = 480;
      const c = comp("Style=List, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      const ny = addHeader(c, 64, C.white, C.n400);

      for (let i = 0; i < 3; i++) {
        const ry = ny + 40 + i * 81;
        const img = rect(80, 80, C.n700);
        img.cornerRadius = 8;
        add(c, img, PAD, ry);
        add(c, txt("List Item Title", 16, "SemiBold", C.white), PAD + 100, ry + 12);
        add(c, txt("Brief description of this list item.", 13, "Regular", C.n400), PAD + 100, ry + 36);
        add(c, txt("View \u2192", 13, "SemiBold", C.white), 1280, ry + 30);
        if (i < 2) add(c, rect(CONTENT_W, 1, C.n700), PAD, ry + 80);
      }
      return c;
    }

    // V7: Masonry / Grid / Light / 3
    function cbV7() {
      const h = 640;
      const c = comp("Style=Masonry, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      const ny = addHeader(c, 64, C.n900, C.n500);
      const w = colW(3);
      const heights = [240, 120, 180];
      for (let i = 0; i < 3; i++) {
        addCard(c, PAD + i * (w + GAP), ny + 40, w, { ...CARD_L, imgH: heights[i] });
      }
      return c;
    }

    // V8: Carousel / Grid / Dark / 3
    function cbV8() {
      const h = 560;
      const c = comp("Style=Carousel, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      const ny = addHeader(c, 64, C.white, C.n400);

      // Single wide card
      const cy = ny + 40;
      const cH = 320;
      const card = rect(CONTENT_W, cH, C.n800);
      card.cornerRadius = 8;
      add(c, card, PAD, cy);

      const cImg = rect(CONTENT_W * 0.6, cH, C.n700);
      cImg.topLeftRadius = 8;
      cImg.bottomLeftRadius = 8;
      add(c, cImg, PAD, cy);

      const tx = PAD + CONTENT_W * 0.6 + 40;
      add(c, txt("Carousel Item Title", 28, "Bold", C.white), tx, cy + 60);
      add(c, wrappedText("Description for the current carousel item.", 16, "Regular", C.n400, CONTENT_W * 0.3), tx, cy + 100);

      // Prev / Next arrows
      const ay = cy + cH / 2 - 20;
      const la = rect(40, 40, C.white, 0.15);
      la.cornerRadius = 20;
      add(c, la, 40, ay);
      add(c, txt("\u2039", 24, "Bold", C.white), 54, ay + 4);
      const ra = rect(40, 40, C.white, 0.15);
      ra.cornerRadius = 20;
      add(c, ra, 1360, ay);
      add(c, txt("\u203A", 24, "Bold", C.white), 1374, ay + 4);

      // Dots
      const dotY = cy + cH + 20;
      const pill = rect(24, 8, C.white);
      pill.cornerRadius = 4;
      add(c, pill, 690, dotY);
      for (let i = 0; i < 2; i++) {
        const d = rect(8, 8, C.white, 0.3);
        d.cornerRadius = 4;
        add(c, d, 722 + i * 16, dotY);
      }
      return c;
    }

    const cbSet = figma.combineAsVariants(
      [cbV1(), cbV2(), cbV3(), cbV4(), cbV5(), cbV6(), cbV7(), cbV8()],
      figma.currentPage
    );
    cbSet.name = "Content Block";
    placeSet(cbSet);

    // ══════════════════════════════════════════════════════════════════
    // COMPONENT SET 4: Object Block
    // ══════════════════════════════════════════════════════════════════

    function addIconCard(parent, x, y, w, o) {
      const cH = 220;
      const bg = rect(w, cH, o.cardBg);
      bg.cornerRadius = 12;
      add(parent, bg, x, y);

      const icon = rect(56, 56, o.iconBg);
      icon.cornerRadius = 12;
      add(parent, icon, x + (w - 56) / 2, y + 24);

      const title = wrappedText("Feature Title", 16, "SemiBold", o.title, w - 32);
      title.textAlignHorizontal = "CENTER";
      add(parent, title, x + 16, y + 96);

      const body = wrappedText("Brief description of this feature.", 13, "Regular", o.body, w - 32);
      body.textAlignHorizontal = "CENTER";
      add(parent, body, x + 16, y + 124);
      return cH;
    }

    const IC_L = { cardBg: C.white, iconBg: C.n100, title: C.n900, body: C.n500 };
    const IC_D = { cardBg: C.n800, iconBg: C.n700, title: C.white, body: C.n400 };

    function obGrid(name, cols, bg, titleC, subC, cardOpts) {
      const h = 440;
      const c = comp(name, 1440, h);
      add(c, rect(1440, h, bg), 0, 0);
      const ny = addHeader(c, 64, titleC, subC, true);
      const w = colW(cols);
      for (let i = 0; i < cols; i++) addIconCard(c, PAD + i * (w + GAP), ny + 40, w, cardOpts);
      return c;
    }

    // OB V4: Alternating / Light / 2
    function obAlt() {
      const h = 600;
      const c = comp("Layout=Alternating, Theme=Light, Columns=2", 1440, h);
      add(c, rect(1440, h, C.white), 0, 0);
      addHeader(c, 64, C.n900, C.n500);

      const panelW = CONTENT_W * 0.4;
      const rowH = 200;

      // Row 1: panel left, text right
      const r1 = 160;
      const p1 = rect(panelW, rowH, C.n100);
      p1.cornerRadius = 16;
      add(c, p1, PAD, r1);
      const ic1 = rect(56, 56, C.n200);
      ic1.cornerRadius = 12;
      add(c, ic1, PAD + panelW / 2 - 28, r1 + rowH / 2 - 28);

      const tx1 = PAD + panelW + 40;
      add(c, txt("Feature Title", 22, "Bold", C.n900), tx1, r1 + 30);
      add(c, wrappedText("Description of this feature explaining its value to the user.", 16, "Regular", C.n500, CONTENT_W * 0.5 - 40), tx1, r1 + 65);
      const b1 = rect(100, 36, C.n900);
      b1.cornerRadius = 6;
      add(c, b1, tx1, r1 + 130);
      add(c, txt("Action", 13, "SemiBold", C.white), tx1 + 28, r1 + 140);

      // Row 2: text left, panel right
      const r2 = r1 + rowH + 64;
      add(c, txt("Feature Title", 22, "Bold", C.n900), PAD, r2 + 30);
      add(c, wrappedText("Description of this feature explaining its value to the user.", 16, "Regular", C.n500, CONTENT_W * 0.5 - 40), PAD, r2 + 65);
      const b2 = rect(100, 36, C.n900);
      b2.cornerRadius = 6;
      add(c, b2, PAD, r2 + 130);
      add(c, txt("Action", 13, "SemiBold", C.white), PAD + 28, r2 + 140);

      const p2 = rect(panelW, rowH, C.n100);
      p2.cornerRadius = 16;
      add(c, p2, PAD + CONTENT_W - panelW, r2);
      const ic2 = rect(56, 56, C.n200);
      ic2.cornerRadius = 12;
      add(c, ic2, PAD + CONTENT_W - panelW / 2 - 28, r2 + rowH / 2 - 28);

      return c;
    }

    const obSet = figma.combineAsVariants([
      obGrid("Layout=Grid, Theme=Light, Columns=3", 3, C.n50, C.n900, C.n500, IC_L),
      obGrid("Layout=Grid, Theme=Dark, Columns=3",  3, C.n900, C.white, C.n400, IC_D),
      obGrid("Layout=Grid, Theme=Light, Columns=2", 2, C.n50, C.n900, C.n500, IC_L),
      obAlt(),
    ], figma.currentPage);
    obSet.name = "Object Block";
    placeSet(obSet);

    // ══════════════════════════════════════════════════════════════════
    // COMPONENT SET 5: Footer
    // ══════════════════════════════════════════════════════════════════

    function createFooter(name, o) {
      const h = 320;
      const c = comp(name, 1440, h);
      add(c, rect(1440, h, o.bg), 0, 0);
      if (o.topBorder) add(c, rect(1440, 1, o.borderC), 0, 0);

      const px = 64, py = 48;

      // Logo + tagline
      const logo = rect(28, 28, o.logo);
      logo.cornerRadius = 4;
      add(c, logo, px, py);
      add(c, txt("Brand Name", 17, "Bold", o.logoTxt), px + 36, py + 4);
      add(c, txt("A short brand tagline goes here.", 14, "Regular", o.tagline, o.tagOp), px, py + 44);

      // Link columns
      const colStart = 640;
      const colSpace = (1440 - px - colStart) / o.cols;
      for (let col = 0; col < o.cols; col++) {
        const cx = colStart + col * colSpace;
        add(c, txt("CATEGORY", 11, "SemiBold", o.label), cx, py);
        for (let r = 0; r < 4; r++) {
          add(c, txt("Link " + (r + 1), 14, "Regular", o.link, o.linkOp), cx, py + 28 + r * 24);
        }
      }

      // Bottom divider + copyright
      const by = h - 48;
      add(c, rect(1440 - px * 2, 1, o.divider), px, by - 20);
      add(c, txt("\u00A9 2026 Brand Name", 12, "Regular", o.copy), px, by);
      let lx = 1200;
      for (const l of ["Privacy", "Terms", "Cookies"]) {
        add(c, txt(l, 12, "Regular", o.copy), lx, by);
        lx += 64;
      }
      return c;
    }

    const FT_D = {
      bg: C.n900, logo: C.white, logoTxt: C.white,
      tagline: C.white, tagOp: 0.5,
      label: C.n400, link: C.white, linkOp: 0.65,
      divider: C.n700, copy: C.n400,
    };
    const FT_L = {
      bg: C.white, topBorder: true, borderC: C.n200,
      logo: C.n900, logoTxt: C.n900,
      tagline: C.n500,
      label: C.n400, link: C.n600, linkOp: 1,
      divider: C.n200, copy: C.n400,
    };

    const footerSet = figma.combineAsVariants([
      createFooter("Theme=Dark, Columns=3",  { ...FT_D, cols: 3 }),
      createFooter("Theme=Dark, Columns=2",  { ...FT_D, cols: 2 }),
      createFooter("Theme=Light, Columns=3", { ...FT_L, cols: 3 }),
      createFooter("Theme=Light, Columns=2", { ...FT_L, cols: 2 }),
    ], figma.currentPage);
    footerSet.name = "Footer";
    placeSet(footerSet);

    // ── Done ──────────────────────────────────────────────────────────
    figma.notify("\u2705 Components created \u2014 Nav \u00B7 Hero \u00B7 Content Block \u00B7 Object Block \u00B7 Footer");

  } catch (err) {
    figma.notify("\u274C Plugin error: " + err.message, { error: true });
    console.error(err);
  }

  figma.closePlugin();
})();
