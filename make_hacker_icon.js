const fs = require('fs');
const zlib = require('zlib');

function generateHackerPNG(size, filepath) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // 8-bit depth
  ihdr[9] = 6;  // RGBA color
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const body = Buffer.concat([t, data]);
    const crc = zlib.crc32(body);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  const rawRows = Buffer.alloc(size * (1 + size * 4));
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    rawRows[rowStart] = 0; // filter type 0
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default: Dark Cyber Charcoal (#080D0C)
      let r = 8, g = 13, b = 12, a = 255;

      const absX = Math.abs(dx);

      // Cyber Hacker Hood Shape
      const inHood = (dy < radius * 0.45 && absX < radius * 0.72 && (dy < -radius * 0.1 || absX + (dy - radius * 0.1) * 0.75 < radius * 0.7));
      const inFace = (absX < radius * 0.42 && dy > -radius * 0.12 && dy < radius * 0.48);

      // Terminal Eye ">"
      const lx = x - size * 0.28;
      const ly = y - size * 0.44;
      const inAngle1 = (lx >= 0 && lx <= size * 0.16 && Math.abs(ly - lx * 0.6) < size * 0.035);
      const inAngle2 = (lx >= 0 && lx <= size * 0.16 && Math.abs(ly + lx * 0.6) < size * 0.035);

      // Cursor "_"
      const rx = x - size * 0.54;
      const ry = y - size * 0.50;
      const inCursor = (rx >= 0 && rx <= size * 0.18 && Math.abs(ry) < size * 0.03);

      // Outer Neon Cyber Ring
      const isRing = (dist >= radius * 0.88 && dist <= radius * 0.98);

      if (inAngle1 || inAngle2 || inCursor) {
        // Neon Hacker Green (#00FF66)
        r = 0; g = 255; b = 102; a = 255;
      } else if (inHood && !inFace) {
        // Dark Cyber Hood (#142622)
        r = 20; g = 38; b = 34; a = 255;
      } else if (inFace) {
        // Hacker Mask Shadow (#040807)
        r = 4; g = 8; b = 7; a = 255;
      } else if (isRing) {
        // Cyber Neon Cyan (#00E5FF)
        r = 0; g = 229; b = 255; a = 255;
      } else if (dist < radius) {
        // Subtle Background Wash (#0B1715)
        r = 11; g = 23; b = 21; a = 255;
      }

      rawRows[px] = r;
      rawRows[px+1] = g;
      rawRows[px+2] = b;
      rawRows[px+3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawRows);
  const png = Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(filepath, png);
}

generateHackerPNG(192, 'C:/Users/K2R/.gemini/antigravity/scratch/promptforge/icon-192.png');
generateHackerPNG(512, 'C:/Users/K2R/.gemini/antigravity/scratch/promptforge/icon-512.png');
console.log('Mr Robot Hacker Cyberpunk PNG Icons Generated Successfully!');
