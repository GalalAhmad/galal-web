const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateNeonIcons() {
  console.log('Generating vibrant neon icons from calligraphy logo...');

  // 1. Dimensions
  const masterSize = 512;
  // Pad logo so when masked or in rounded squircle, it has comfortable breathing room (~70% width)
  const logoWidth = 350;
  const logoHeight = Math.round(logoWidth * (598 / 1024)); // ~204

  // 2. Load and resize the clean white logo
  const resizedLogo = await sharp('public/assets/logo-white.png')
    .resize(logoWidth, logoHeight)
    .toBuffer();

  const { data: rawAlpha, info } = await sharp(resizedLogo)
    .ensureAlpha()
    .extractChannel(3)
    .toBuffer({ resolveWithObject: true });

  const numPixels = info.width * info.height;
  const corePixels = Buffer.alloc(numPixels * 4);
  const glowWidePixels = Buffer.alloc(numPixels * 4);
  const glowMidPixels = Buffer.alloc(numPixels * 4);
  const glowTightPixels = Buffer.alloc(numPixels * 4);

  for (let y = 0; y < info.height; y++) {
    const t = y / info.height;
    // Core color: Mint electric white at top (#F0FFF9) to high-neon emerald (#00FFA3) at bottom
    const cr = Math.round(240 * (1 - t) + 10 * t);
    const cg = 255;
    const cb = Math.round(250 * (1 - t) + 160 * t);

    for (let x = 0; x < info.width; x++) {
      const idx = y * info.width + x;
      const alpha = rawAlpha[idx];
      const pIdx = idx * 4;

      // Core crisp letterform
      corePixels[pIdx] = cr;
      corePixels[pIdx + 1] = cg;
      corePixels[pIdx + 2] = cb;
      corePixels[pIdx + 3] = alpha;

      // Outer glow: Intense Electric Cyan (#00E5FF)
      glowWidePixels[pIdx] = 0;
      glowWidePixels[pIdx + 1] = 229;
      glowWidePixels[pIdx + 2] = 255;
      glowWidePixels[pIdx + 3] = Math.round(alpha * 0.85);

      // Mid glow: Vivid Neon Mint (#00FFA3)
      glowMidPixels[pIdx] = 0;
      glowMidPixels[pIdx + 1] = 255;
      glowMidPixels[pIdx + 2] = 163;
      glowMidPixels[pIdx + 3] = Math.round(alpha * 0.95);

      // Tight hot glow: Emerald-Lime (#22C55E)
      glowTightPixels[pIdx] = 52;
      glowTightPixels[pIdx + 1] = 211;
      glowTightPixels[pIdx + 2] = 153;
      glowTightPixels[pIdx + 3] = alpha;
    }
  }

  const coreImg = await sharp(corePixels, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

  const glowWide = await sharp(glowWidePixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .blur(22)
    .toBuffer();

  const glowMid = await sharp(glowMidPixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .blur(10)
    .toBuffer();

  const glowTight = await sharp(glowTightPixels, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .blur(3)
    .toBuffer();

  // 3. Create SVG Background: Deep midnight obsidian with subtle neon ambient light & rounded squircle
  const bgSvg = `
    <svg width="${masterSize}" height="${masterSize}" viewBox="0 0 ${masterSize} ${masterSize}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#0F2132" />
          <stop offset="55%" stop-color="#081422" />
          <stop offset="100%" stop-color="#030811" />
        </radialGradient>
        <radialGradient id="neonGlowBg" cx="50%" cy="50%" r="48%">
          <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.22" />
          <stop offset="50%" stop-color="#00D2B4" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="neonBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.7" />
          <stop offset="40%" stop-color="#00D2B4" stop-opacity="0.25" />
          <stop offset="70%" stop-color="#0080FF" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#00FFA3" stop-opacity="0.5" />
        </linearGradient>
      </defs>
      <!-- Base Background with smooth modern squircle (rx=110) -->
      <rect width="${masterSize}" height="${masterSize}" rx="110" fill="url(#bgGrad)" />
      <!-- Ambient Neon Flare -->
      <circle cx="${masterSize / 2}" cy="${masterSize / 2}" r="${masterSize * 0.44}" fill="url(#neonGlowBg)" />
      <!-- Sleek Neon Inset Border -->
      <rect x="12" y="12" width="${masterSize - 24}" height="${masterSize - 24}" rx="100" fill="none" stroke="url(#neonBorder)" stroke-width="3" />
    </svg>
  `;

  const bgBuffer = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  const logoLeft = Math.round((masterSize - info.width) / 2);
  const logoTop = Math.round((masterSize - info.height) / 2);

  // Composite the layers: Background -> Wide Cyan Glow -> Mid Neon Mint Glow -> Tight Glow -> Core Sharp Lettering
  const master512 = await sharp(bgBuffer)
    .composite([
      { input: glowWide, left: logoLeft, top: logoTop },
      { input: glowMid, left: logoLeft, top: logoTop },
      { input: glowTight, left: logoLeft, top: logoTop },
      { input: coreImg, left: logoLeft, top: logoTop },
    ])
    .png()
    .toBuffer();

  // Save 512x512
  await sharp(master512).toFile('public/icon-512.png');
  console.log('Saved public/icon-512.png');

  // Save 192x192
  await sharp(master512).resize(192, 192).toFile('public/icon-192.png');
  console.log('Saved public/icon-192.png');

  // Save Apple Touch Icon 180x180
  await sharp(master512).resize(180, 180).toFile('public/apple-touch-icon.png');
  console.log('Saved public/apple-touch-icon.png');

  // Save favicon.png (64x64 for crisp high-DPI browser tabs)
  await sharp(master512).resize(64, 64).toFile('public/favicon.png');
  console.log('Saved public/favicon.png');

  // Also create a dedicated 32x32 transparent favicon with tight neon glow for tab bar clarity
  const tabLogoWidth = 26;
  const tabLogoHeight = Math.round(tabLogoWidth * (598 / 1024)); // ~15
  const tabResized = await sharp('public/assets/logo-white.png').resize(tabLogoWidth, tabLogoHeight).toBuffer();
  
  // For favicon 32x32: sleek dark circle/squircle with glowing logo
  const fav32Svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="favBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#0F2538" />
          <stop offset="100%" stop-color="#040912" />
        </radialGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#favBg)" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" fill="none" stroke="#00FFA3" stroke-width="1" stroke-opacity="0.6" />
    </svg>
  `;
  const fav32Bg = await sharp(Buffer.from(fav32Svg)).png().toBuffer();
  
  // Color the small logo vibrant neon mint
  const { data: sAlpha, info: sInfo } = await sharp(tabResized).ensureAlpha().extractChannel(3).toBuffer({ resolveWithObject: true });
  const sPixels = Buffer.alloc(sInfo.width * sInfo.height * 4);
  for (let i = 0; i < sInfo.width * sInfo.height; i++) {
    const a = sAlpha[i];
    sPixels[i * 4] = 0;       // R
    sPixels[i * 4 + 1] = 255; // G (max green)
    sPixels[i * 4 + 2] = 180; // B (neon teal)
    sPixels[i * 4 + 3] = a;
  }
  const sCore = await sharp(sPixels, { raw: { width: sInfo.width, height: sInfo.height, channels: 4 } }).png().toBuffer();
  
  const fav32 = await sharp(fav32Bg)
    .composite([
      { input: sCore, left: Math.round((32 - sInfo.width) / 2), top: Math.round((32 - sInfo.height) / 2) }
    ])
    .png()
    .toBuffer();

  // Create favicon.ico (Sharp does not output native multi-ico directly, but an ICO header wrapping PNG or a 32x32 PNG renamed to ico works in all modern browsers, or we construct standard ICO buffer)
  // Standard ICO header:
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved (0)
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0);  // width
  icoEntry.writeUInt8(32, 1);  // height
  icoEntry.writeUInt8(0, 2);   // color palette
  icoEntry.writeUInt8(0, 3);   // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bits per pixel
  icoEntry.writeUInt32LE(fav32.length, 8); // image size
  icoEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  const icoFileBuffer = Buffer.concat([icoHeader, icoEntry, fav32]);
  fs.writeFileSync('public/favicon.ico', icoFileBuffer);
  console.log('Saved public/favicon.ico');

  console.log('All neon icons created successfully!');
}

generateNeonIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
