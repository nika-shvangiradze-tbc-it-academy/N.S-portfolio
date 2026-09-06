const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../assets/projects");

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".png") return;

  const base = filePath.slice(0, -4);
  const jpgPath = `${base}.jpg`;
  const webpPath = `${base}.webp`;
  const input = sharp(filePath, { failOn: "none" });
  const meta = await input.metadata();

  const maxWidth = filePath.includes("mobile") ? 780 : 1600;
  const pipeline = sharp(filePath, { failOn: "none" }).resize({
    width: Math.min(meta.width || maxWidth, maxWidth),
    withoutEnlargement: true,
  });

  await pipeline
    .clone()
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(jpgPath);

  await pipeline
    .clone()
    .webp({ quality: 74 })
    .toFile(webpPath);

  // Replace oversized PNG heroes with optimized JPG as primary fallback source
  const pngStat = fs.statSync(filePath);
  const jpgStat = fs.statSync(jpgPath);
  console.log(
    `${path.relative(root, filePath)}  ${(pngStat.size / 1024).toFixed(0)}KB → jpg ${(jpgStat.size / 1024).toFixed(0)}KB`
  );
}

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith(".png")) await optimizeFile(full);
  }
}

walk(root)
  .then(() => console.log("Optimization complete"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
