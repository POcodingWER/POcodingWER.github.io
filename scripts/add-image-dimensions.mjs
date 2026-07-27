#!/usr/bin/env node
/**
 * Add width/height to local markdown images for CLS.
 * Usage: node scripts/add-image-dimensions.mjs
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "_posts");

const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)(\{:[^}]*\})?/g;

function getDimensions(src) {
  const normalized = src.startsWith("/") ? src.slice(1) : src;
  const full = path.join(root, normalized);
  if (!fs.existsSync(full)) return null;

  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${full}"`, {
      encoding: "utf8",
    });
    const w = out.match(/pixelWidth: (\d+)/)?.[1];
    const h = out.match(/pixelHeight: (\d+)/)?.[1];
    return w && h ? { w, h } : null;
  } catch {
    return null;
  }
}

function appendDimensions(attrs, w, h) {
  if (attrs) {
    if (/width\s*=/.test(attrs)) return attrs;
    return attrs.replace(/\}$/, ` width="${w}" height="${h}"}`);
  }
  return `{: width="${w}" height="${h}"}`;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith(".md") ? [full] : [];
  });
}

let updatedFiles = 0;
let updatedImages = 0;

for (const filePath of walk(postsDir)) {
  let content = fs.readFileSync(filePath, "utf8");
  let fileChanged = false;

  content = content.replace(imgRegex, (match, alt, src, attrs) => {
    if (src.startsWith("http://") || src.startsWith("https://")) return match;
    if (attrs && /width\s*=/.test(attrs)) return match;

    const dims = getDimensions(src);
    if (!dims) return match;

    fileChanged = true;
    updatedImages += 1;
    return `![${alt}](${src})${appendDimensions(attrs, dims.w, dims.h)}`;
  });

  if (fileChanged) {
    fs.writeFileSync(filePath, content);
    updatedFiles += 1;
  }
}

console.log(`Updated ${updatedImages} images in ${updatedFiles} files.`);
