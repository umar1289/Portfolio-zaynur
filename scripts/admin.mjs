#!/usr/bin/env node
/**
 * Local admin panel for the product catalogue.
 *
 *   npm run admin
 *
 * Serves a small form on http://localhost:4322 that writes straight into the
 * repo: photos go to src/assets/images/products/, entries go to
 * src/data/products.json. "Publish" commits and pushes, which triggers the
 * hosting provider's rebuild.
 *
 * Deliberately dependency-free: only Node built-ins, so `npm install` stays
 * small and there is nothing extra to keep patched.
 */

import { createServer } from "node:http";
import { Buffer } from "node:buffer";
import { execFile } from "node:child_process";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCTS_JSON = path.join(ROOT, "src/data/products.json");
const CATEGORIES_TS = path.join(ROOT, "src/data/categories.ts");
const IMAGES_DIR = path.join(ROOT, "src/assets/images/products");
const UI_HTML = path.join(ROOT, "scripts/admin-ui.html");

const PORT = 4322;
const MAX_BODY_BYTES = 25 * 1024 * 1024; // photos arrive base64-encoded
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/* ---------------------------------------------------------------- helpers */

/** Uzbek-friendly slug: oʻ/gʻ and apostrophes collapse to plain letters. */
function slugify(input) {
  return input
    .toLowerCase()
    .replace(/o['’ʻ`]/g, "o")
    .replace(/g['’ʻ`]/g, "g")
    .replace(/['’ʻ`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uniqueId(base, taken) {
  const seed = base || "mahsulot";
  if (!taken.has(seed)) return seed;
  let n = 2;
  while (taken.has(`${seed}-${n}`)) n += 1;
  return `${seed}-${n}`;
}

async function readProducts() {
  return JSON.parse(await readFile(PRODUCTS_JSON, "utf8"));
}

async function writeProducts(products) {
  await writeFile(PRODUCTS_JSON, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

/** Categories live in a .ts file; pull the id/label pairs out of it. */
async function readCategories() {
  const src = await readFile(CATEGORIES_TS, "utf8");
  const categories = [];
  const re = /\{\s*id:\s*"([^"]+)"\s*,\s*label:\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) categories.push({ id: m[1], label: m[2] });
  return categories.filter((c) => c.id !== "all");
}

async function git(args) {
  try {
    const { stdout, stderr } = await execFileAsync("git", args, { cwd: ROOT });
    return { ok: true, out: `${stdout}${stderr}`.trim() };
  } catch (err) {
    return { ok: false, out: `${err.stdout ?? ""}${err.stderr ?? ""}`.trim() || String(err) };
  }
}

async function pendingChanges() {
  const res = await git(["status", "--porcelain"]);
  if (!res.ok) return 0;
  return res.out ? res.out.split("\n").filter(Boolean).length : 0;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Fayl juda katta (25 MB dan oshmasin)"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("Ma'lumot noto'g'ri formatda"));
      }
    });
    req.on("error", reject);
  });
}

/* ------------------------------------------------------------- endpoints */

async function handleList(res) {
  send(res, 200, {
    products: await readProducts(),
    categories: await readCategories(),
    pending: await pendingChanges(),
  });
}

async function handleCreate(req, res) {
  const body = await readBody(req);
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!name) return send(res, 400, { error: "Mahsulot nomini kiriting" });

  const categories = await readCategories();
  if (!categories.some((c) => c.id === category)) {
    return send(res, 400, { error: "Kategoriyani tanlang" });
  }

  const products = await readProducts();
  const id = uniqueId(slugify(name), new Set(products.map((p) => p.id)));

  let image = "";
  if (body.imageData && body.imageName) {
    const ext = path.extname(String(body.imageName)).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return send(res, 400, { error: `Rasm formati mos emas (${ext}). JPG, PNG, WebP yoki AVIF bo'lsin.` });
    }
    const base64 = String(body.imageData).replace(/^data:[^,]+,/, "");
    const buffer = Buffer.from(base64, "base64");
    if (buffer.length === 0) return send(res, 400, { error: "Rasm fayli bo'sh" });

    image = `${id}${ext}`;
    await writeFile(path.join(IMAGES_DIR, image), buffer);
  }

  products.push({ id, name, category, note, image });
  await writeProducts(products);

  send(res, 200, { ok: true, id, pending: await pendingChanges() });
}

async function handleUpdate(req, res, id) {
  const body = await readBody(req);
  const products = await readProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return send(res, 404, { error: "Mahsulot topilmadi" });

  if (typeof body.name === "string" && body.name.trim()) product.name = body.name.trim();
  if (typeof body.note === "string") product.note = body.note.trim();
  if (typeof body.category === "string") {
    const categories = await readCategories();
    if (!categories.some((c) => c.id === body.category)) {
      return send(res, 400, { error: "Kategoriya noto'g'ri" });
    }
    product.category = body.category;
  }

  await writeProducts(products);
  send(res, 200, { ok: true, pending: await pendingChanges() });
}

async function handleDelete(res, id) {
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return send(res, 404, { error: "Mahsulot topilmadi" });

  const [removed] = products.splice(index, 1);
  await writeProducts(products);

  // Drop the photo too, but only if no other entry still points at it.
  if (removed.image && !products.some((p) => p.image === removed.image)) {
    const file = path.join(IMAGES_DIR, path.basename(removed.image));
    if (existsSync(file)) await unlink(file).catch(() => {});
  }

  send(res, 200, { ok: true, pending: await pendingChanges() });
}

async function handleMove(req, res, id) {
  const { direction } = await readBody(req);
  const products = await readProducts();
  const i = products.findIndex((p) => p.id === id);
  if (i === -1) return send(res, 404, { error: "Mahsulot topilmadi" });

  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= products.length) return send(res, 200, { ok: true, pending: await pendingChanges() });

  [products[i], products[j]] = [products[j], products[i]];
  await writeProducts(products);
  send(res, 200, { ok: true, pending: await pendingChanges() });
}

async function handlePublish(res) {
  const status = await git(["status", "--porcelain"]);
  if (status.ok && !status.out) {
    return send(res, 200, { ok: true, message: "O'zgarish yo'q — hammasi allaqachon saytda." });
  }

  const add = await git(["add", "-A"]);
  if (!add.ok) return send(res, 500, { error: `git add xatosi: ${add.out}` });

  const stamp = new Date().toLocaleString("uz-UZ");
  const commit = await git(["commit", "-m", `Katalogni yangilash (${stamp})`]);
  if (!commit.ok && !/nothing to commit/i.test(commit.out)) {
    return send(res, 500, { error: `git commit xatosi: ${commit.out}` });
  }

  const push = await git(["push"]);
  if (!push.ok) {
    return send(res, 500, {
      error: `O'zgarishlar saqlandi, lekin serverga yuborilmadi:\n${push.out}`,
    });
  }

  send(res, 200, {
    ok: true,
    message: "Saytga yuborildi. 1-2 daqiqada yangilanadi.",
    pending: await pendingChanges(),
  });
}

async function handleMedia(res, name) {
  const file = path.join(IMAGES_DIR, path.basename(name));
  if (!existsSync(file)) return send(res, 404, { error: "Topilmadi" });
  const ext = path.extname(file).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
  };
  res.writeHead(200, { "Content-Type": types[ext] ?? "application/octet-stream" });
  res.end(await readFile(file));
}

/* ---------------------------------------------------------------- server */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const { pathname } = url;

  try {
    if (req.method === "GET" && pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(await readFile(UI_HTML));
    }
    if (req.method === "GET" && pathname === "/api/products") return await handleList(res);
    if (req.method === "POST" && pathname === "/api/products") return await handleCreate(req, res);
    if (req.method === "POST" && pathname === "/api/publish") return await handlePublish(res);

    const media = pathname.match(/^\/media\/(.+)$/);
    if (req.method === "GET" && media) return await handleMedia(res, decodeURIComponent(media[1]));

    const move = pathname.match(/^\/api\/products\/([^/]+)\/move$/);
    if (req.method === "POST" && move) return await handleMove(req, res, decodeURIComponent(move[1]));

    const single = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (single) {
      const id = decodeURIComponent(single[1]);
      if (req.method === "PATCH") return await handleUpdate(req, res, id);
      if (req.method === "DELETE") return await handleDelete(res, id);
    }

    send(res, 404, { error: "Topilmadi" });
  } catch (err) {
    send(res, 500, { error: err.message ?? String(err) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  Admin panel: ${url}`);
  console.log("  To'xtatish uchun: Ctrl+C\n");
  execFile("open", [url], () => {});
});
