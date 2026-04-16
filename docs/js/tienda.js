import { addToCart } from "./cart.js";

function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");
}

function card(product) {
  const el = document.createElement("article");
  el.className =
    "group overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5";

  const img = document.createElement("img");
  img.src = product.image || "./assets/placeholder.svg";
  img.alt = product.name || "Producto";
  img.loading = "lazy";
  img.className = "aspect-square w-full object-cover";

  const body = document.createElement("div");
  body.className = "p-5";

  const title = document.createElement("h3");
  title.className = "text-base font-normal leading-snug text-brand-ink";
  title.textContent = product.name || product.id;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    "mt-4 w-full rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-normal text-white hover:brightness-95 active:brightness-90";
  btn.textContent = "Añadir a cotización";
  btn.addEventListener("click", () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        sourceUrl: product.sourceUrl
      },
      1
    );
    btn.textContent = "Añadido";
    setTimeout(() => (btn.textContent = "Añadir a cotización"), 900);
  });

  body.append(title, btn);
  el.append(img, body);
  return el;
}

async function loadProducts() {
  const res = await fetch("./data/products.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar products.json");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function render(products) {
  const grid = document.querySelector("#products-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (const p of products) grid.append(card(p));
}

function categories(products) {
  const set = new Set(products.map((p) => p.category).filter(Boolean));
  return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
}

function mountFilters(all) {
  const search = document.querySelector("#products-search");
  const select = document.querySelector("#products-category");

  if (select) {
    select.innerHTML = "";
    for (const c of categories(all)) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      select.append(opt);
    }
  }

  function apply() {
    const q = normalize(search?.value ?? "");
    const cat = select?.value ?? "Todas";
    const filtered = all.filter((p) => {
      const matchesText =
        !q ||
        normalize(p.name).includes(q) ||
        normalize(p.category).includes(q);
      const matchesCat = cat === "Todas" || p.category === cat;
      return matchesText && matchesCat;
    });
    render(filtered);
    const countEl = document.querySelector("[data-products-count]");
    if (countEl) countEl.textContent = String(filtered.length);
  }

  search?.addEventListener("input", apply);
  select?.addEventListener("change", apply);
  apply();
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const products = await loadProducts();
    mountFilters(products);
  } catch (err) {
    const msg = document.querySelector("#products-error");
    if (msg) msg.textContent = String(err?.message ?? err);
  }
});
