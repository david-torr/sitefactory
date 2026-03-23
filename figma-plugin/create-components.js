// Site Factory — Create Components Plugin
// Creates component sets with variants for Nav, Hero, Content Block, Object Block, Footer.
(async () => {
  try {
    // ── Page setup: create/reuse "Components" page ──────────────────
    var componentsPage = figma.root.children.find(function(p) { return p.name === "Components"; });
    if (!componentsPage) {
      componentsPage = figma.createPage();
      componentsPage.name = "Components";
    }
    figma.currentPage = componentsPage;
    // Remove existing component sets with matching names
    var namesToClear = ["Nav", "Hero", "Content Block", "Object Block", "Footer"];
    var existingChildren = componentsPage.children.slice();
    for (var ci = 0; ci < existingChildren.length; ci++) {
      if (namesToClear.indexOf(existingChildren[ci].name) !== -1) existingChildren[ci].remove();
    }
    // ── Font loading ──────────────────────────────────────────────────
    await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
    await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
    await figma.loadFontAsync({ family: "DM Sans", style: "SemiBold" });
    await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });
    var C = {
      black: { r: 0,     g: 0,     b: 0     },
      white: { r: 1,     g: 1,     b: 1     },
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
    var PAD = 80;
    var CONTENT_W = 1280;
    var GAP = 24;
    var currentY = 0;
    function applyFill(node, color, opacity) {
      node.fills = [{ type: "SOLID", color: color, opacity: opacity !== undefined ? opacity : 1 }];
    }
    function txt(content, size, style, color, opacity) {
      var t = figma.createText();
      t.fontName = { family: "DM Sans", style: style };
      t.characters = content;
      t.fontSize = size;
      applyFill(t, color, opacity);
      return t;
    }
    function rect(w, h, color, opacity) {
      var r = figma.createRectangle();
      r.resize(w, h);
      if (color) applyFill(r, color, opacity);
      return r;
    }
    function comp(name, w, h) {
      var c = figma.createComponent();
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
    function wrappedText(content, size, style, color, w, opacity) {
      var t = txt(content, size, style, color, opacity);
      t.textAutoResize = "HEIGHT";
      t.resize(w, t.height);
      return t;
    }
    function addHeader(parent, y, titleCol, subCol, centered) {
      var title = txt("Section Title", 30, "Bold", titleCol);
      var sub = txt("Section subtitle goes here.", 16, "Regular", subCol);
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
    // ── NAV ──────────────────────────────────────────────────────────
    function createNav(name, o) {
      var c = comp(name, 1440, 64);
      add(c, rect(1440, 64, o.bg, o.bgOp), 0, 0);
      if (o.border) add(c, rect(1440, 1, o.border), 0, 63);
      var logo = rect(28, 28, o.logo);
      logo.cornerRadius = 4;
      add(c, logo, 80, 18);
      add(c, txt("Brand Name", 16, "Bold", o.logoTxt), 116, 21);
      var lx = 580;
      var links = ["Link 1", "Link 2", "Link 3"];
      for (var i = 0; i < links.length; i++) {
        add(c, txt(links[i], 14, "Regular", o.link, o.linkOp), lx, 23);
        lx += 80;
      }
      var bx = 1270, by = 16, bw = 90, bh = 32;
      if (o.ctaOutline) {
        var bg = rect(bw, bh, C.white, 0);
        bg.cornerRadius = 6;
        bg.fills = [];
        bg.strokes = [{ type: "SOLID", color: o.ctaStroke }];
        bg.strokeWeight = 1;
        add(c, bg, bx, by);
      } else {
        var bg2 = rect(bw, bh, o.ctaBg);
        bg2.cornerRadius = 6;
        add(c, bg2, bx, by);
      }
      add(c, txt("Account", 13, "SemiBold", o.ctaTxt), bx + 16, by + 8);
      return c;
    }
    var navSet = figma.combineAsVariants([
      createNav("Mode=Solid, Theme=Light", { bg: C.white, border: C.n200, logo: C.n900, logoTxt: C.n900, link: C.n900, ctaBg: C.n900, ctaTxt: C.white }),
      createNav("Mode=Solid, Theme=Dark",  { bg: C.n900, logo: C.white, logoTxt: C.white, link: C.white, linkOp: 0.85, ctaBg: C.white, ctaTxt: C.n900 }),
      createNav("Mode=Overlay, Theme=Dark",  { bg: C.n900, bgOp: 0.4, logo: C.white, logoTxt: C.white, link: C.white, linkOp: 0.85, ctaOutline: true, ctaStroke: C.white, ctaTxt: C.white }),
      createNav("Mode=Overlay, Theme=Light", { bg: C.white, bgOp: 0.4, logo: C.n900, logoTxt: C.n900, link: C.n900, ctaOutline: true, ctaStroke: C.n900, ctaTxt: C.n900 }),
    ], figma.currentPage);
    navSet.name = "Nav";
    placeSet(navSet);
    // ── HERO ─────────────────────────────────────────────────────────
    function createHero(name, o) {
      var c = comp(name, 1440, 560);
      add(c, rect(1440, 560, o.bg), 0, 0);
      var cx = o.ctr ? 400 : 80;
      var cy = 180;
      var h1 = txt("Section Heading", 52, "Bold", o.h1);
      if (o.ctr) { h1.textAlignHorizontal = "CENTER"; h1.textAutoResize = "HEIGHT"; h1.resize(640, h1.height); }
      add(c, h1, cx, cy);
      var p = txt("A short description of this section that supports the heading above.", 18, "Regular", o.p, o.pOp);
      if (o.ctr) { p.textAlignHorizontal = "CENTER"; p.textAutoResize = "HEIGHT"; p.resize(640, p.height); }
      add(c, p, cx, cy + 70);
      var by2 = cy + 130;
      var b1x = o.ctr ? 520 : cx;
      var btn1 = rect(140, 44, o.cta1Bg);
      btn1.cornerRadius = 6;
      add(c, btn1, b1x, by2);
      add(c, txt("Get Started", 14, "SemiBold", o.cta1Txt), b1x + 28, by2 + 13);
      var b2x = b1x + 160;
      var btn2 = rect(120, 44, C.white, 0);
      btn2.cornerRadius = 6;
      btn2.fills = [];
      btn2.strokes = [{ type: "SOLID", color: o.cta2Border }];
      btn2.strokeWeight = 1;
      add(c, btn2, b2x, by2);
      add(c, txt("Learn More", 14, "SemiBold", o.cta2Txt), b2x + 20, by2 + 13);
      var dy = 510;
      var pill = rect(24, 8, o.h1);
      pill.cornerRadius = 4;
      add(c, pill, 690, dy);
      for (var i = 0; i < 2; i++) {
        var dot = rect(8, 8, o.h1, 0.3);
        dot.cornerRadius = 4;
        add(c, dot, 722 + i * 16, dy);
      }
      return c;
    }
    var heroSet = figma.combineAsVariants([
      createHero("Position=Left, Theme=Dark",    { bg: C.n900, h1: C.white, p: C.white, pOp: 0.65, cta1Bg: C.white, cta1Txt: C.n900, cta2Border: C.white, cta2Txt: C.white }),
      createHero("Position=Centre, Theme=Dark",  { bg: C.n900, h1: C.white, p: C.white, pOp: 0.65, ctr: true, cta1Bg: C.white, cta1Txt: C.n900, cta2Border: C.white, cta2Txt: C.white }),
      createHero("Position=Left, Theme=Light",   { bg: C.n50,  h1: C.n900, p: C.n500, cta1Bg: C.n900, cta1Txt: C.white, cta2Border: C.n900, cta2Txt: C.n900 }),
      createHero("Position=Centre, Theme=Light", { bg: C.n50,  h1: C.n900, p: C.n500, ctr: true, cta1Bg: C.n900, cta1Txt: C.white, cta2Border: C.n900, cta2Txt: C.n900 }),
    ], figma.currentPage);
    heroSet.name = "Hero";
    placeSet(heroSet);
    // ── CONTENT BLOCK ─────────────────────────────────────────────────
    function addCard(parent, x, y, w, o) {
      var cardH = o.imgH + 140;
      var bg = rect(w, cardH, o.cardBg);
      bg.cornerRadius = 8;
      add(parent, bg, x, y);
      var img = rect(w, o.imgH, o.imgBg);
      img.topLeftRadius = 8;
      img.topRightRadius = 8;
      add(parent, img, x, y);
      add(parent, txt("Card Title", 16, "SemiBold", o.title), x + 16, y + o.imgH + 16);
      add(parent, wrappedText("Brief description of this card content goes here.", 13, "Regular", o.body, w - 32), x + 16, y + o.imgH + 44);
      var btn = rect(80, 28, o.btnBg);
      btn.cornerRadius = 6;
      add(parent, btn, x + 16, y + o.imgH + 90);
      add(parent, txt("Action", 12, "SemiBold", o.btnTxt), x + 28, y + o.imgH + 97);
      return cardH;
    }
    var CARD_L = { imgH: 160, cardBg: C.white, imgBg: C.n200, title: C.n900, body: C.n500, btnBg: C.n900, btnTxt: C.white };
    var CARD_D = { imgH: 160, cardBg: C.n800,  imgBg: C.n700,  title: C.white, body: C.n400, btnBg: C.white, btnTxt: C.n900 };
    function cbV1() {
      var h = 560; var c = comp("Style=Card, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      var ny = addHeader(c, 64, C.n900, C.n500);
      var w = colW(3);
      for (var i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_L);
      return c;
    }
    function cbV2() {
      var h = 560; var c = comp("Style=Card, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      var ny = addHeader(c, 64, C.white, C.n400);
      var w = colW(3);
      for (var i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_D);
      return c;
    }
    function cbV3() {
      var h = 560; var c = comp("Style=Card, Layout=Grid, Theme=Light, Columns=2", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      var ny = addHeader(c, 64, C.n900, C.n500);
      var w = colW(2);
      for (var i = 0; i < 2; i++) addCard(c, PAD + i * (w + GAP), ny + 40, w, CARD_L);
      return c;
    }
    function cbV4() {
      var h = 720; var c = comp("Style=Card, Layout=Featured, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      var ny = addHeader(c, 64, C.n900, C.n500);
      var fy = ny + 40; var fH = 280;
      var fb = rect(CONTENT_W, fH, C.white); fb.cornerRadius = 8; add(c, fb, PAD, fy);
      var fImg = rect(CONTENT_W / 2, fH, C.n300); fImg.topLeftRadius = 8; fImg.bottomLeftRadius = 8; add(c, fImg, PAD, fy);
      var ftx = PAD + CONTENT_W / 2 + 32;
      add(c, txt("Featured Title", 28, "Bold", C.n900), ftx, fy + 40);
      add(c, wrappedText("A longer description for the featured content card.", 16, "Regular", C.n500, CONTENT_W / 2 - 80), ftx, fy + 80);
      var fbtn = rect(100, 36, C.n900); fbtn.cornerRadius = 6; add(c, fbtn, ftx, fy + 140);
      add(c, txt("Action", 13, "SemiBold", C.white), ftx + 28, fy + 150);
      var sy = fy + fH + 24; var w = colW(3);
      var smallCard = { imgH: 120, cardBg: C.white, imgBg: C.n200, title: C.n900, body: C.n500, btnBg: C.n900, btnTxt: C.white };
      for (var i = 0; i < 3; i++) addCard(c, PAD + i * (w + GAP), sy, w, smallCard);
      return c;
    }
    function cbV5() {
      var h = 480; var c = comp("Style=List, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.white), 0, 0);
      var ny = addHeader(c, 64, C.n900, C.n500);
      for (var i = 0; i < 3; i++) {
        var ry = ny + 40 + i * 81;
        var img = rect(80, 80, C.n200); img.cornerRadius = 8; add(c, img, PAD, ry);
        add(c, txt("List Item Title", 16, "SemiBold", C.n900), PAD + 100, ry + 12);
        add(c, txt("Brief description of this list item.", 13, "Regular", C.n500), PAD + 100, ry + 36);
        add(c, txt("View \u2192", 13, "SemiBold", C.n900), 1280, ry + 30);
        if (i < 2) add(c, rect(CONTENT_W, 1, C.n200), PAD, ry + 80);
      }
      return c;
    }
    function cbV6() {
      var h = 480; var c = comp("Style=List, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      var ny = addHeader(c, 64, C.white, C.n400);
      for (var i = 0; i < 3; i++) {
        var ry = ny + 40 + i * 81;
        var img = rect(80, 80, C.n700); img.cornerRadius = 8; add(c, img, PAD, ry);
        add(c, txt("List Item Title", 16, "SemiBold", C.white), PAD + 100, ry + 12);
        add(c, txt("Brief description of this list item.", 13, "Regular", C.n400), PAD + 100, ry + 36);
        add(c, txt("View \u2192", 13, "SemiBold", C.white), 1280, ry + 30);
        if (i < 2) add(c, rect(CONTENT_W, 1, C.n700), PAD, ry + 80);
      }
      return c;
    }
    function cbV7() {
      var h = 640; var c = comp("Style=Masonry, Layout=Grid, Theme=Light, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n50), 0, 0);
      var ny = addHeader(c, 64, C.n900, C.n500);
      var w = colW(3);
      var heights = [240, 120, 180];
      for (var i = 0; i < 3; i++) {
        var mCard = { imgH: heights[i], cardBg: C.white, imgBg: C.n200, title: C.n900, body: C.n500, btnBg: C.n900, btnTxt: C.white };
        addCard(c, PAD + i * (w + GAP), ny + 40, w, mCard);
      }
      return c;
    }
    function cbV8() {
      var h = 560; var c = comp("Style=Carousel, Layout=Grid, Theme=Dark, Columns=3", 1440, h);
      add(c, rect(1440, h, C.n900), 0, 0);
      var ny = addHeader(c, 64, C.white, C.n400);
      var cy2 = ny + 40; var cH = 320;
      var card = rect(CONTENT_W, cH, C.n800); card.cornerRadius = 8; add(c, card, PAD, cy2);
      var cImg = rect(CONTENT_W * 0.6, cH, C.n700); cImg.topLeftRadius = 8; cImg.bottomLeftRadius = 8; add(c, cImg, PAD, cy2);
      var tx = PAD + CONTENT_W * 0.6 + 40;
      add(c, txt("Carousel Item Title", 28, "Bold", C.white), tx, cy2 + 60);
      add(c, wrappedText("Description for the current carousel item.", 16, "Regular", C.n400, CONTENT_W * 0.3), tx, cy2 + 100);
      var ay = cy2 + cH / 2 - 20;
      var la = rect(40, 40, C.white, 0.15); la.cornerRadius = 20; add(c, la, 40, ay);
      add(c, txt("\u2039", 24, "Bold", C.white), 54, ay + 4);
      var ra = rect(40, 40, C.white, 0.15); ra.cornerRadius = 20; add(c, ra, 1360, ay);
      add(c, txt("\u203A", 24, "Bold", C.white), 1374, ay + 4);
      var dotY = cy2 + cH + 20;
      var pill2 = rect(24, 8, C.white); pill2.cornerRadius = 4; add(c, pill2, 690, dotY);
      for (var i = 0; i < 2; i++) {
        var d = rect(8, 8, C.white, 0.3); d.cornerRadius = 4; add(c, d, 722 + i * 16, dotY);
      }
      return c;
    }
    var cbSet = figma.combineAsVariants(
      [cbV1(), cbV2(), cbV3(), cbV4(), cbV5(), cbV6(), cbV7(), cbV8()],
      figma.currentPage
    );
    cbSet.name = "Content Block";
    placeSet(cbSet);
    // ── OBJECT BLOCK ──────────────────────────────────────────────────
    function addIconCard(parent, x, y, w, o) {
      var cH = 220;
      var bg = rect(w, cH, o.cardBg); bg.cornerRadius = 12; add(parent, bg, x, y);
      var icon = rect(56, 56, o.iconBg); icon.cornerRadius = 12; add(parent, icon, x + (w - 56) / 2, y + 24);
      var title = wrappedText("Feature Title", 16, "SemiBold", o.title, w - 32);
      title.textAlignHorizontal = "CENTER"; add(parent, title, x + 16, y + 96);
      var body = wrappedText("Brief description of this feature.", 13, "Regular", o.body, w - 32);
      body.textAlignHorizontal = "CENTER"; add(parent, body, x + 16, y + 124);
      return cH;
    }
    var IC_L = { cardBg: C.white, iconBg: C.n100, title: C.n900, body: C.n500 };
    var IC_D = { cardBg: C.n800,  iconBg: C.n700,  title: C.white, body: C.n400 };
    function obGrid(name, cols, bg, titleC, subC, cardOpts) {
      var h = 440; var c = comp(name, 1440, h);
      add(c, rect(1440, h, bg), 0, 0);
      var ny = addHeader(c, 64, titleC, subC, true);
      var w = colW(cols);
      for (var i = 0; i < cols; i++) addIconCard(c, PAD + i * (w + GAP), ny + 40, w, cardOpts);
      return c;
    }
    function obAlt() {
      var h = 600; var c = comp("Layout=Alternating, Theme=Light, Columns=2", 1440, h);
      add(c, rect(1440, h, C.white), 0, 0);
      addHeader(c, 64, C.n900, C.n500);
      var panelW = CONTENT_W * 0.4;
      var rowH = 200;
      var r1 = 160;
      var p1 = rect(panelW, rowH, C.n100); p1.cornerRadius = 16; add(c, p1, PAD, r1);
      var ic1 = rect(56, 56, C.n200); ic1.cornerRadius = 12; add(c, ic1, PAD + panelW / 2 - 28, r1 + rowH / 2 - 28);
      var tx1 = PAD + panelW + 40;
      add(c, txt("Feature Title", 22, "Bold", C.n900), tx1, r1 + 30);
      add(c, wrappedText("Description of this feature explaining its value to the user.", 16, "Regular", C.n500, CONTENT_W * 0.5 - 40), tx1, r1 + 65);
      var b1 = rect(100, 36, C.n900); b1.cornerRadius = 6; add(c, b1, tx1, r1 + 130);
      add(c, txt("Action", 13, "SemiBold", C.white), tx1 + 28, r1 + 140);
      var r2 = r1 + rowH + 64;
      add(c, txt("Feature Title", 22, "Bold", C.n900), PAD, r2 + 30);
      add(c, wrappedText("Description of this feature explaining its value to the user.", 16, "Regular", C.n500, CONTENT_W * 0.5 - 40), PAD, r2 + 65);
      var b2 = rect(100, 36, C.n900); b2.cornerRadius = 6; add(c, b2, PAD, r2 + 130);
      add(c, txt("Action", 13, "SemiBold", C.white), PAD + 28, r2 + 140);
      var p2 = rect(panelW, rowH, C.n100); p2.cornerRadius = 16; add(c, p2, PAD + CONTENT_W - panelW, r2);
      var ic2 = rect(56, 56, C.n200); ic2.cornerRadius = 12; add(c, ic2, PAD + CONTENT_W - panelW / 2 - 28, r2 + rowH / 2 - 28);
      return c;
    }
    var obSet = figma.combineAsVariants([
      obGrid("Layout=Grid, Theme=Light, Columns=3", 3, C.n50,  C.n900, C.n500, IC_L),
      obGrid("Layout=Grid, Theme=Dark, Columns=3",  3, C.n900, C.white, C.n400, IC_D),
      obGrid("Layout=Grid, Theme=Light, Columns=2", 2, C.n50,  C.n900, C.n500, IC_L),
      obAlt(),
    ], figma.currentPage);
    obSet.name = "Object Block";
    placeSet(obSet);
    // ── FOOTER ────────────────────────────────────────────────────────
    function createFooter(name, o) {
      var h = 320; var c = comp(name, 1440, h);
      add(c, rect(1440, h, o.bg), 0, 0);
      if (o.topBorder) add(c, rect(1440, 1, o.borderC), 0, 0);
      var px = 64, py = 48;
      var logo = rect(28, 28, o.logo); logo.cornerRadius = 4; add(c, logo, px, py);
      add(c, txt("Brand Name", 17, "Bold", o.logoTxt), px + 36, py + 4);
      add(c, txt("A short brand tagline goes here.", 14, "Regular", o.tagline, o.tagOp), px, py + 44);
      var colStart = 640;
      var colSpace = (1440 - px - colStart) / o.cols;
      for (var col = 0; col < o.cols; col++) {
        var cx2 = colStart + col * colSpace;
        add(c, txt("CATEGORY", 11, "SemiBold", o.label), cx2, py);
        for (var r = 0; r < 4; r++) {
          add(c, txt("Link " + (r + 1), 14, "Regular", o.link, o.linkOp), cx2, py + 28 + r * 24);
        }
      }
      var by3 = h - 48;
      add(c, rect(1440 - px * 2, 1, o.divider), px, by3 - 20);
      add(c, txt("\u00A9 2026 Brand Name", 12, "Regular", o.copy), px, by3);
      var lx2 = 1200;
      var legal = ["Privacy", "Terms", "Cookies"];
      for (var j = 0; j < legal.length; j++) {
        add(c, txt(legal[j], 12, "Regular", o.copy), lx2, by3);
        lx2 += 64;
      }
      return c;
    }
    var FT_D = { bg: C.n900, logo: C.white, logoTxt: C.white, tagline: C.white, tagOp: 0.5, label: C.n400, link: C.white, linkOp: 0.65, divider: C.n700, copy: C.n400 };
    var FT_L = { bg: C.white, topBorder: true, borderC: C.n200, logo: C.n900, logoTxt: C.n900, tagline: C.n500, label: C.n400, link: C.n600, linkOp: 1, divider: C.n200, copy: C.n400 };
    var footerSet = figma.combineAsVariants([
      createFooter("Theme=Dark, Columns=3",  Object.assign({}, FT_D, { cols: 3 })),
      createFooter("Theme=Dark, Columns=2",  Object.assign({}, FT_D, { cols: 2 })),
      createFooter("Theme=Light, Columns=3", Object.assign({}, FT_L, { cols: 3 })),
      createFooter("Theme=Light, Columns=2", Object.assign({}, FT_L, { cols: 2 })),
    ], figma.currentPage);
    footerSet.name = "Footer";
    placeSet(footerSet);
    figma.notify("\u2705 Components created \u2014 Nav \u00B7 Hero \u00B7 Content Block \u00B7 Object Block \u00B7 Footer");
  } catch (err) {
    figma.notify("\u274C Plugin error: " + err.message, { error: true });
    console.error(err);
  }
  figma.closePlugin();
})();
