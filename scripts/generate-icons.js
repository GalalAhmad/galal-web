const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo-white.png');
  const publicDir = path.join(process.cwd(), 'public');

  // Load and trim logo
  const trimmedLogoBuffer = await sharp(logoPath).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuffer).metadata();
  console.log('Trimmed logo size:', trimmedMeta.width, 'x', trimmedMeta.height);

  // Function to create an icon on brand emerald background (#4E7E76)
  async function createIcon(size, paddingPercent = 0.15, isRounded = false) {
    const pad = Math.round(size * paddingPercent);
    const targetW = size - (pad * 2);
    const targetH = Math.round(targetW * (trimmedMeta.height / trimmedMeta.width));
    
    // Resize logo to fit inside target box
    const resizedLogo = await sharp(trimmedLogoBuffer)
      .resize(targetW, targetH, { fit: 'inside' })
      .toBuffer();
    
    const resizedMeta = await sharp(resizedLogo).metadata();

    const top = Math.round((size - resizedMeta.height) / 2);
    const left = Math.round((size - resizedMeta.width) / 2);

    let backgroundSvg;
    if (isRounded) {
      const rx = Math.round(size * 0.22); // Elegant squircle radius
      backgroundSvg = Buffer.from(
        `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" rx="${rx}" fill="#4E7E76" />
        </svg>`
      );
    } else {
      backgroundSvg = Buffer.from(
        `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="#4E7E76" />
        </svg>`
      );
    }

    return sharp(backgroundSvg)
      .composite([{ input: resizedLogo, top, left }])
      .png()
      .toBuffer();
  }

  // Generate 512x512
  const icon512 = await createIcon(512, 0.12, false);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  console.log('Generated icon-512.png');

  // Generate 192x192
  const icon192 = await createIcon(192, 0.12, false);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  console.log('Generated icon-192.png');

  // Generate apple-touch-icon (180x180)
  const appleIcon = await createIcon(180, 0.12, false);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);
  console.log('Generated apple-touch-icon.png');

  // Generate favicon.png (64x64 and 32x32)
  const favicon64 = await createIcon(64, 0.10, true);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon64);
  console.log('Generated favicon.png');

  // Generate favicon.ico (using 48x48 rounded)
  const favicon48 = await createIcon(48, 0.10, true);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon48);
  console.log('Generated favicon.ico');

  console.log('All icons generated successfully with brand emerald contrast!');
}

generateIcons().catch(console.error);
