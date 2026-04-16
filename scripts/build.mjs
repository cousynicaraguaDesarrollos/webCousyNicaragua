import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const distDir = path.join(projectRoot, "dist");
const srcPagesDir = path.join(projectRoot, "src", "pages");
const srcDataDir = path.join(projectRoot, "src", "data");
const srcJsDir = path.join(projectRoot, "src", "js");
const srcConfigDir = path.join(projectRoot, "src", "config");
const publicDir = path.join(projectRoot, "public");

function ensureEmptyDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(fromDir, toDir) {
  if (!fs.existsSync(fromDir)) return;
  fs.mkdirSync(toDir, { recursive: true });
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function copyPages() {
  if (!fs.existsSync(srcPagesDir)) return;
  const entries = fs.readdirSync(srcPagesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const from = path.join(srcPagesDir, entry.name);
    const to = path.join(distDir, entry.name);
    fs.copyFileSync(from, to);
  }
}

ensureEmptyDir(distDir);
fs.mkdirSync(path.join(distDir, "assets"), { recursive: true });
fs.mkdirSync(path.join(distDir, "data"), { recursive: true });
fs.mkdirSync(path.join(distDir, "js"), { recursive: true });
fs.mkdirSync(path.join(distDir, "config"), { recursive: true });

copyPages();
copyDir(srcDataDir, path.join(distDir, "data"));
copyDir(srcJsDir, path.join(distDir, "js"));
copyDir(srcConfigDir, path.join(distDir, "config"));
copyDir(publicDir, distDir);

