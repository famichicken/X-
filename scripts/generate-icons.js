// Generate PWA icons as simple PNG files using pure Node.js
// Creates a black circle with "X" text icon

const fs = require("fs");
const { createCanvas } = require("canvas");

function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Black background
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // White "X" text
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.floor(size * 0.5)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("X", size / 2, size / 2 + size * 0.02);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath} (${size}x${size})`);
}

generateIcon(192, "public/icons/icon-192.png");
generateIcon(512, "public/icons/icon-512.png");
