import sharp from "sharp";
import path from "node:path";

const root = process.cwd();
const width = 1200;
const height = 630;

const grid = Array.from({ length: 10 }, (_, index) => {
  const x = 500 + index * 75;
  return `<path d="M${x} 80V500" stroke="#EEF0F3" stroke-width="1"/>`;
}).join("");

const rows = Array.from({ length: 6 }, (_, index) => {
  const y = 110 + index * 70;
  return `<path d="M470 ${y}H1200" stroke="#EEF0F3" stroke-width="1"/>`;
}).join("");

const background = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#F7F8FA"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#152039" flood-opacity=".13"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <g opacity=".9">${grid}${rows}</g>
    <text x="54" y="142" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#131416">BEDWARS SHOP</text>
    <text x="50" y="250" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="900" fill="#131416">RANKED</text>
    <text x="50" y="332" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="900" fill="#245BEA">CARRIES</text>
    <rect x="50" y="382" width="252" height="70" rx="7" fill="#245BEA"/>
    <text x="76" y="428" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="800" fill="#FFFFFF">FROM $3.00</text>
    <g filter="url(#shadow)">
      <circle cx="565" cy="310" r="76" fill="#FFFFFF"/>
      <circle cx="745" cy="310" r="76" fill="#FFFFFF"/>
      <circle cx="925" cy="310" r="76" fill="#FFFFFF"/>
      <circle cx="1105" cy="310" r="76" fill="#FFFFFF"/>
    </g>
    <rect x="470" y="405" width="730" height="46" rx="3" fill="#FFFFFF" filter="url(#shadow)"/>
    <text x="565" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2" fill="#8B9098">GOLD</text>
    <text x="745" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2" fill="#8B9098">DIAMOND</text>
    <text x="925" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2" fill="#8B9098">EMERALD</text>
    <text x="1105" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="800" letter-spacing="1.2" fill="#8B9098">NIGHTMARE</text>
  </svg>
`);

const icons = [
  { file: "gold.png", left: 495 },
  { file: "diamond.png", left: 675 },
  { file: "emerald.png", left: 855 },
  { file: "nightmare.png", left: 1035 },
];

const mask = Buffer.from(
  `<svg width="140" height="140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="70" fill="white"/></svg>`,
);

const composites = await Promise.all(
  icons.map(async ({ file, left }) => ({
    input: await sharp(path.join(root, "public", "items", file))
      .resize(140, 140, { fit: "cover" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer(),
    left,
    top: 240,
  })),
);

await sharp(background)
  .composite(composites)
  .png()
  .toFile(path.join(root, "public", "og-shop-v3.png"));

