# webCousyNicaragua

Proyecto web estático para Cousy Nicaragua.

## Estructura

- `src/`: código fuente (HTML, JS, estilos, data/config).
- `public/`: archivos estáticos fuente (imágenes, fonts, `robots.txt`, `sitemap.xml`, etc).
- `docs/`: build listo para GitHub Pages (copia del contenido de `dist/`).
- `scripts/`: scripts de desarrollo/build.

## Desarrollo / Build

- Dev: `npm run dev`
- Build: `npm run build` (genera `dist/`)

## GitHub Pages

GitHub Pages solo permite publicar desde la raíz del repo o desde `/docs`. Por eso este repo usa `docs/`.

1. En GitHub: **Settings → Pages → Build and deployment**: selecciona **Deploy from a branch** y luego **Branch: `main` / Folder: `/docs`**.
2. Cada vez que construyas, copia `dist/` a `docs/` antes de hacer push:
   - PowerShell:
     - `Remove-Item -Recurse -Force docs; New-Item -ItemType Directory -Force docs | Out-Null; Copy-Item -Recurse -Force dist\* docs\`

Nota: `docs/.nojekyll` está incluido para que GitHub Pages sirva carpetas que empiezan con `_` dentro de `assets/`.
