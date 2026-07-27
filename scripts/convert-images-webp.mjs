#!/usr/bin/env node
/**
 * Convert PNG/JPEG images to WebP and update markdown references.
 * Requires: cwebp (brew install webp)
 * Usage: node scripts/convert-images-webp.mjs
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imgDir = path.join(root, "img");
const postsDir = path.join(root, "_posts");
const quality = 82;

const exts = new Set([".png", ".jpg", ".jpeg"]);
let converted = 0;
let savedBytes = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function toWebp(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!exts.has(ext)) return null;

  const webpPath = srcPath.replace(/\.(png|jpe?g)$/i, ".webp");
  if (fs.existsSync(webpPath)) {
    const srcStat = fs.statSync(srcPath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs >= srcStat.mtimeMs) return webpPath;
  }

  execSync(`cwebp -q ${quality} "${srcPath}" -o "${webpPath}"`, { stdio: "pipe" });
  const before = fs.statSync(srcPath).size;
  const after = fs.statSync(webpPath).size;
  savedBytes += Math.max(0, before - after);
  converted += 1;
  return webpPath;
}

for (const file of walk(imgDir)) {
  toWebp(file);
}

const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)(\{:[^}]*\})?/g;
let updatedFiles = 0;
let updatedRefs = 0;

function walkPosts(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkPosts(full) : full.endsWith(".md") ? [full] : [];
  });
}

for (const filePath of walkPosts(postsDir)) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  content = content.replace(imgRegex, (match, alt, src, attrs) => {
    if (src.startsWith("http://") || src.startsWith("https://")) return match;
    if (!/\.(png|jpe?g)(\?.*)?$/i.test(src)) return match;

    const webpSrc = src.replace(/\.(png|jpe?g)(\?.*)?$/i, ".webp$2");
    const localPath = path.join(root, webpSrc.replace(/^\//, ""));
    if (!fs.existsSync(localPath)) return match;

    changed = true;
    updatedRefs += 1;
    return `![${alt}](${webpSrc})${attrs || ""}`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    updatedFiles += 1;
  }
}

const savedMB = (savedBytes / 1024 / 1024).toFixed(1);
console.log(`Converted ${converted} images, saved ~${savedMB} MB`);
console.log(`Updated ${updatedRefs} markdown refs in ${updatedFiles} files`);
