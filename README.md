# Choricar

Sitio estático del proyecto **Choricar**, basado en un boilerplate Gulp 5 + Pug + Sass (Dart Sass) + esbuild, con deploy a GitHub Pages.

**Demo:** [https://kikeestradadev.github.io/choricar/](https://kikeestradadev.github.io/choricar/)  
**Repo:** [https://github.com/kikeestradadev/choricar](https://github.com/kikeestradadev/choricar)

---

## Para agentes de IA (léelo completo — documento autosuficiente)

Este README es la **única fuente de verdad** que debes asumir sobre el boilerplate Choricar. Contiene arquitectura, pipeline, convenciones, rules y skills **completos**. No intentes abrir `.cursor/rules/` ni `.cursor/skills/`: pueden estar bloqueados o no existir en tu contexto. Todo lo normativo ya está embebido más abajo.

### Cómo usar este documento

Puedes estar en uno de estos roles (o ambos):

1. **Diseñar el prompt / la especificación de la app** que se construirá encima de este boilerplate.  
   Entonces traduce requisitos de producto a piezas que **encajen** en esta arquitectura (páginas Pug, componentes BEM, JSON de datos, módulos JS, seeds en `data/db/`, etc.). No propongas stacks incompatibles (React, Next, Tailwind, APIs de escritura en Gulp, backend real obligatorio, etc.) salvo que el humano lo pida explícitamente como cambio de stack.

2. **Implementar o refactorizar código** en el repo.  
   Entonces sigue las convenciones al pie de la letra y usa el [mapa de decisión](#mapa-de-decisión-qué-aplicar) antes del primer edit.

### Contrato no negociable

| Debe | No debe |
|------|---------|
| Sitio **estático** (HTML en `public/`) | SPA framework (React/Vue/Angular) por defecto |
| **Pug** + **Sass** + **BEM** + shell `.main-container` / `.container` | Tailwind / utility-first |
| Datos de UI en `src/data/*-data.json` | Objetos grandes inline en el `.pug` |
| JS en módulos camelCase + `initComponents` | Lógica de UI metida en `index.js` |
| Swiper (si aplica) por **CDN** | Swiper por npm |
| Sass solo con `@import` | `@use` / `@forward` |
| Hover con `@media (hover: hover) and (pointer: fine)` | `:hover` suelto |
| “BD” fake = seed JSON + `fetch` + `localStorage` | Backend / API Gulp que escriba archivos |
| Deploy = `npm run deploy` → GitHub Pages | Asumir otro hosting sin que lo digan |

**Regla de oro:** si un hábito genérico de “buen frontend 2024/2025” contradice este README, **gana este README**.

### Al redactar prompts o specs de producto

Cuando ayudes a definir *qué* se va a construir, estructura las entregas pensando en este mapa mental:

```text
Página (src/pug/pages/*.pug)
  └── incluye componentes (src/pug/components/*.pug)
        ├── estilos simétricos (src/scss/modules/_*.scss) registrados en modules.scss
        ├── datos (src/data/*-data.json) → locales camelCase en Pug
        └── comportamiento opcional (src/js/modules/*.js) → initComponents

Si hay tablas / formularios / CRUD demo:
  seed  → src/data/db/{tabla}.json
  store → src/js/db/*.js
  UI    → src/js/modules/*Grid.js + pug + *-grid-data.json
```

Nombra piezas con la **simetría** kebab (Pug/SCSS/JSON/BEM) ↔ camelCase (JS).  
Prefiere demos estáticas deployables a Pages; no asumas servidor Node en producción.

El resto de este archivo detalla cada capa. Léelo completo antes de proponer arquitectura o código.

---

## Qué hace este boilerplate

Genera un sitio HTML estático a partir de:

| Entrada | Salida |
|---------|--------|
| `src/pug/pages/**/*.pug` | `public/*.html` (páginas del sitio) |
| `src/pug/style-guide/style-guide.pug` | `public/style-guide.html` (storybook / specimens) |
| `src/scss/styles.scss` | `public/styles.css` |
| `src/js/index.js` (+ módulos) | `public/index.js` (bundle esbuild) |
| `src/assets/**`, `src/images/**`, `src/data/**/*.json` | `public/assets/`, `public/images/`, `public/data/` |

Flujo habitual:

1. Desarrollas en `src/`.
2. `npm run dev` sirve `public/` en `http://localhost:3000` con live reload (SSE, sin BrowserSync).
3. `npm run build` sube `assetVersion`, compila en producción (minify HTML/CSS/JS, sin sourcemaps).
4. `npm run deploy` = build + publica `public/` a la rama `gh-pages`.

No hay backend real. Las demos de “BD” usan JSON seed + `fetch` + `localStorage` (ver [Emulación de BD](#emulación-de-bd-y-json-estático)).

---

## Stack

- **HTML:** Pug (`gulp-pug`)
- **CSS:** Dart Sass (`gulp-sass` + `sass`) → PostCSS (`autoprefixer`, `cssnano` en prod)
- **JS:** ES modules → esbuild → un solo `public/index.js`
- **Datos Pug:** JSON en `src/data/` inyectados como locales
- **Sliders:** Swiper **solo por CDN** en `src/pug/config/template.pug` (no dependencia npm)
- **Deploy:** `gh-pages` → GitHub Pages
- **Formato:** Prettier + `@prettier/plugin-pug`
- **Node:** `>= 22.13.1` (ver `.nvmrc`: `22.13.1`)
- **Lockfile:** solo `package-lock.json` (no commits de yarn/pnpm lock)

---

## Scripts npm

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Alias de `gulp` → tarea `serve`: build inicial + server puerto 3000 + watch + live reload |
| `npm run build` | `scripts/bump-assets.mjs` (patch +1 de `assetVersion`) + `NODE_ENV=production gulp build` |
| `npm run deploy` | `npm run build` + `gh-pages -d public` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run gulp` | Gulp CLI directo |

### Deploy (detalle)

- Script: `"deploy": "npm run build && gh-pages -d public"`
- `homepage` en `package.json`: `https://kikeestradadev.github.io/choricar/`
- Publica el contenido de `public/` a la rama `gh-pages` del repo `kikeestradadev/choricar`
- Tras deploy, la demo queda en esa URL de GitHub Pages

### Cache-busting (`assetVersion`)

- Campo en `package.json`: `"assetVersion": "x.y.z"` (independiente de `"version"` del paquete)
- Gulp lo inyecta a Pug como local `assetVersion`
- En el layout: `styles.css?v=${assetVersion}`, `index.js?v=${assetVersion}`, `assets/prism.css?v=…`
- `npm run build` ejecuta `scripts/bump-assets.mjs` → incrementa el patch (`1.0.22` → `1.0.23`)
- En `npm run dev` **no** se bumpea; el live reload invalida CSS en caliente
- **No** hardcodees `?v=…` en markup; **no** pongas `assetVersion` en JSON de `src/data/`; **no** añadas `?v=` a CDN (Swiper, fuentes)

---

## Árbol del proyecto

```text
.
├── package.json              # name: choricar, homepage Pages, assetVersion, scripts
├── gulpfile.js               # pipeline completo (pug, styles, scripts, assets, serve, build)
├── scripts/bump-assets.mjs   # +1 patch a assetVersion en build
├── public/                   # OUTPUT — lo que se sirve y se deploya (no editar a mano)
└── src/
    ├── pug/
    │   ├── pages/            # páginas del sitio (index.pug → public/index.html)
    │   ├── style-guide/      # página storybook + specimens (NO módulos UI de producto)
    │   ├── components/       # módulos UI reutilizables del sitio
    │   └── config/           # template.pug, open-graph, twitter-cards
    ├── scss/
    │   ├── styles.scss       # ÚNICO entrypoint Sass
    │   ├── core/             # breakpoints, layout, normalize, fonts, hacks
    │   └── modules/          # parciales _*.scss + modules.scss (registro)
    ├── js/
    │   ├── index.js          # entry: importa módulos + initComponents
    │   ├── modules/          # UI (grids, sliders, containers…)
    │   └── db/               # store / seed / FK / JOIN (emulación BD)
    ├── data/
    │   ├── *-data.json       # datos de plantillas Pug (inyectados como locales)
    │   └── db/               # seeds de “tablas” → se copian a public/data/db/
    ├── assets/               # estáticos → public/assets
    ├── images/               # imágenes → public/images
    └── md/                   # markdown includes (jstransformer-markdown-it)
```

---

## Pipeline Gulp (comportamiento real)

### Locales Pug (`pugLocals`)

Gulp lee **solo** JSON en la **raíz** de `src/data/` (no recorre `src/data/db/` para locales):

1. Archivos `*-data.json` → local camelCase del basename completo  
   - `color-table-data.json` → `colorTableData` = **objeto raíz del archivo**
2. JSON legados sin sufijo `-data` (`example.json`, `slider.json`, …) → se hace `Object.assign` de sus claves de primer nivel
3. Siempre se inyecta `assetVersion` desde `package.json`

Los seeds de BD en `src/data/db/` **no** son locales Pug: se copian a `public/data/db/` y el JS hace `fetch('./data/db/…')`.

### Tareas principales

| Tarea | Entrada → salida |
|-------|------------------|
| `pug:pages` | `src/pug/pages/**/*.pug` → `public/` |
| `pug:style-guide` | `style-guide.pug` → `public/style-guide.html` |
| `styles` | `src/scss/styles.scss` → `public/styles.css` (+ map en dev) |
| `scripts` | esbuild `src/js/index.js` → `public/index.js` |
| `assets` | copia assets, images y `src/data/**/*.json` → `public/…` / `public/data/…` |
| `serve` | build paralelo + HTTP server + watches |
| `build` | pug + styles + scripts + assets + limpia maps |

### Live reload

- Endpoint SSE: `/__livereload`
- CSS: invalidación de query en `<link>` sin full reload
- HTML/JS/data: reload (páginas concretas cuando cambia un page pug)
- Solo la pestaña visible reacciona

### Producción

- HTML minify (`html-minifier-next`)
- CSS: autoprefixer + cssnano
- JS: minify esbuild, sin sourcemaps
- Maps eliminados al final del build

---

## Layout global (obligatorio)

Definido en `src/scss/core/_layout.scss`. **Sin frameworks CSS.**

```scss
.main-container {
	width: 100%;
	max-width: var(--main-container); // default 3000px
	margin: 0 auto;
	padding: 0 15px;
}

.container {
	width: 100%;
	max-width: var(--container); // default 1600px
	margin: 0 auto;
	padding: 0;
}
```

### Shell de todo módulo de página

```pug
section(class='example-module')
	div(class='main-container example-module__shell')
		div(class='container example-module__container')
			//- contenido del módulo
```

Reglas:

1. Raíz = bloque BEM (`.example-module`).
2. Dentro siempre `.main-container` → `.container`.
3. Puedes combinar con `__shell` / `__container` BEM **sin** redefinir width/max-width/padding del shell.
4. Tokens de ancho solo en `:root` (`_layout.scss`); no hardcodees `3000px` / `1600px` en markup.
5. **No** uses utilidades tipo Tailwind (`w-full`, `max-w-[…]`, `mx-auto`, `px-[15px]`, etc.).
6. Header/footer del layout: `.main-header` / `.main-footer`.
7. **Excepción style-guide:** si el specimen ya vive dentro de `.style-guide-container` (que aporta el shell), **no dupliques** otro `main-container`.

---

## Sass

### Entry

`src/scss/styles.scss` **debe** importar primero breakpoints:

```scss
@import "./core/breakpoints";
@import "./core/normalize";
@import "./core/layout";
@import "./core/fonts";
@import "./modules/modules";
@import "./core/hacks";
```

### Breakpoints (variables Sass globales)

En `src/scss/core/_breakpoints.scss`:

| Variable | Valor |
|----------|-------|
| `$s` | `0px` |
| `$sm` | `480px` |
| `$m` | `640px` |
| `$l` | `960px` |
| `$lg` | `1280px` |
| `$xl` | `1600px` |
| `$xxl` | `1800px` |
| `$xxxl` | `1920px` |
| `$xxxxl` | `6000px` |

Uso en media queries: `@media (width >= $sm) { … }`  
Espejados a `:root` como `--sm`, `--l`, etc. (para propiedades CSS; **no** uses `var()` dentro de `@media`).

### Registro de módulos

Cada parcial `src/scss/modules/_foo.scss` se registra en `src/scss/modules/modules.scss`:

```scss
@import "foo";
```

### Prohibiciones Sass

- **No** `@use` / `@forward` — solo `@import`
- **No** reimportar breakpoints en cada parcial
- **No** Tailwind ni utility-first
- Un parcial = un bloque BEM principal

### Hover solo con puntero fino

`:hover` suelto se “pega” en touch. **Todo hover** va así:

```scss
.btn {
	background: var(--btn-primary);

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			background: var(--btn-primary-hover);
		}
	}
}
```

Usa `:focus-visible` para teclado. No simules hover en mobile con clases tipo `.btn--hover`.

---

## Pug

### Sintaxis larga (obligatoria)

**Correcto:**

```pug
section(class='color-table' id='colores')
	div(class='main-container color-table__shell')
		div(class='container color-table__container')
			h2(class='color-table__title')= colorTableData.title
```

**Incorrecto (prohibido):**

```pug
section.color-table#colores
	.main-container
		.container
			h2.title= colorTableData.title
```

Reglas:

1. Nunca `tag.class`, `tag#id`, `.class` ni Emmet shorthand
2. Clases solo con atributo `class="…"` / `class='…'`
3. Clases dinámicas dentro del atributo `class`
4. BEM + shell de layout; sin utilidades Tailwind

### Dónde va cada Pug

| Tipo | Carpeta |
|------|---------|
| Páginas del sitio | `src/pug/pages/` |
| Módulos UI de producto | `src/pug/components/` |
| Specimens / storybook | `src/pug/style-guide/` |
| Layout base | `src/pug/config/template.pug` |

Include desde páginas: `include ../components/nombre-modulo`

### Datos dinámicos (`src/data/`)

Si el componente recorre objetos/arrays, **los datos van en JSON**, no inline en el `.pug`.

| Pieza | Ubicación | Ejemplo |
|-------|-----------|---------|
| Markup | `src/pug/components/{name}.pug` o `style-guide/{name}.pug` | `color-table.pug` |
| Datos | `src/data/{name}-data.json` | `color-table-data.json` |
| Local Pug | camelCase del basename | `colorTableData` |
| SCSS | `src/scss/modules/_{name}.scss` | `_color-table.scss` |

El archivo `{name}-data.json` **es el objeto** a recorrer (no lo envuelvas en una clave extra).

**Prohibido:**

- Objetos grandes con `- const foo = { … }` al inicio del componente
- `src/pug/data/` o `*-data.pug`
- Seeds de tablas BD en la raíz de `src/data/` → van en `src/data/db/`

---

## Simetría de componentes (naming)

Las capas de un componente **comparten nombre base**:

```text
main-menu.pug
_main-menu.scss
mainMenu.js                 (opcional)
main-menu-data.json         (si hay datos)
bloque BEM: .main-menu
```

| Capa | Ruta | Convención |
|------|------|------------|
| Markup UI | `src/pug/components/kebab-case.pug` | kebab-case |
| Markup style guide | `src/pug/style-guide/kebab-case.pug` | kebab-case |
| Estilos | `src/scss/modules/_kebab-case.scss` | `_` + kebab |
| Script | `src/js/modules/camelCase.js` | camelCase |
| Datos Pug | `src/data/kebab-case-data.json` | `*-data.json` |
| Bloque BEM | `.kebab-case` | igual al Pug |

Registro obligatorio:

1. `@import "main-menu";` en `modules.scss`
2. Si hay JS: import + llamada en `initComponents` de `src/js/index.js`
3. Datos en JSON; Gulp inyecta el local

---

## JavaScript

### Estructura

- Entry: `src/js/index.js` → bundle `public/index.js`
- UI: `src/js/modules/`
- Emulación BD: `src/js/db/` (**no** mezclar store/JOIN en `modules/`)

### Convención de módulo UI

| Capa | Convención | Ejemplo |
|------|------------|---------|
| Archivo | `camelCase.js` | `alliesSlider.js` |
| Constante | mismo nombre | `const alliesSlider` |
| Raíz DOM | kebab alineado al Pug | `.allies-slider` |
| Flag ready | `dataset.{camelCase}Ready` | `root.dataset.alliesSliderReady` |

Sliders Swiper: el archivo **termina en `Slider`** (`heroSlider.js`), no uses `swiper` en el nombre.

### Plantilla de módulo

```js
const alliesSlider = () => {
	if (typeof Swiper === 'undefined') return;

	document.querySelectorAll('.allies-slider').forEach((root) => {
		if (root.dataset.alliesSliderReady === 'true') return;

		const el = root.querySelector('.swiper');
		if (!el) return;

		new Swiper(el, { slidesPerView: 1, spaceBetween: 16 });

		root.dataset.alliesSliderReady = 'true';
	});
};

export default alliesSlider;
```

### Entrada

```js
import alliesSlider from './modules/alliesSlider';

const initComponents = () => {
	alliesSlider();
};

document.addEventListener('DOMContentLoaded', initComponents);
```

Reglas:

1. Un archivo por módulo; `const` + flecha + `export default`
2. Multi-instancia con `querySelectorAll`; acota a `root`
3. Idempotente con `dataset.*Ready`
4. Valida globals CDN (`Swiper`) antes de usarlos
5. No implementes módulos dentro de `index.js`
6. No añadas deps npm al bundle sin necesidad explícita
7. Swiper = CDN en `template.pug`, **nunca** npm

---

## Cómo crear un componente (flujo completo)

1. **JSON** (si hay listados/contenido): `src/data/main-menu-data.json`
2. **Pug** en `components/` (o `style-guide/` si es specimen): sintaxis larga + shell layout + BEM
3. **SCSS** `_main-menu.scss` sin `@use`, sin redefinir el shell
4. **Registro** `@import "main-menu";` en `modules.scss`
5. **JS opcional** en `modules/`, import + `initComponents`
6. **Include** desde la página
7. Si afecta CSS/JS publicados: `npm run build` (bumpea `assetVersion`)

---

## Cómo crear un slider (Swiper CDN)

Naming obligatorio:

| Pieza | Ejemplo |
|-------|---------|
| Pug | `src/pug/components/main-slider.pug` |
| JSON | `src/data/main-slider-data.json` → local `mainSliderData` |
| SCSS | `src/scss/modules/_main-slider.scss` |
| Raíz DOM | `.main-slider` |
| JS | `src/js/modules/mainSlider.js` |

Markup: shell BEM + estructura Swiper (`.swiper`, `.swiper-wrapper`, `.swiper-slide`, pagination/nav).  
JS: multi-instancia + `dataset.mainSliderReady` + controles scoped a `root`.  
Siempre pareja pug + json + scss; datos **nunca** inline.

---

## Emulación de BD con archivos JSON (leer entero)

Este boilerplate **no tiene MySQL, Postgres ni API backend**. En su lugar incluye un **emulador de base de datos** pensado para demos y prototipos que funcionan igual en `npm run dev` y en **GitHub Pages**.

La gente / agentes que diseñen la app **deben modelar datos como tablas JSON + store en el navegador**, no como un servidor real (salvo que el humano pida explícitamente otro stack).

### Idea en una frase

> Cada “tabla” es un archivo `.json` en `src/data/db/`. Gulp lo copia a `public/data/db/`. El JS hace `fetch` de ese seed la primera vez y, si hay CRUD, guarda el estado mutable en `localStorage` del navegador.

### Analogía con una BD real

| BD real | En este boilerplate |
|---------|---------------------|
| Tabla `personas` | Archivo `src/data/db/persona.json` con clave `"personas": [ … ]` |
| Tabla `tutores` | Archivo `src/data/db/tutor.json` con clave `"tutores": [ … ]` |
| Primary key | Campo `id` en cada registro (se genera si falta) |
| Foreign key | p. ej. `persona.tutorId` → `tutor.id` |
| JOIN | Helper JS (`findTutorName`, etc.) en `src/js/db/` |
| INSERT / UPDATE / DELETE | Mutar el store en memoria + `localStorage.setItem` |
| Servidor SQL | **No existe** — solo archivos estáticos + browser storage |
| Backup en el repo tras editar en la UI | **No** — el JSON del repo es solo el *seed* inicial |

### Dos tipos de JSON (no confundirlos)

| Tipo | Ruta | Para qué sirve | ¿Lo lee Pug? | ¿Lo lee el “emulador”? |
|------|------|----------------|--------------|------------------------|
| **Datos de plantilla / UI** | `src/data/*-data.json` (raíz) | Títulos, labels, fields del form, textos | Sí → locales camelCase | No (salvo que copies urls ahí) |
| **Seeds de tablas (BD)** | `src/data/db/{tabla}.json` | Filas iniciales de cada “tabla” | No | Sí → `fetch('./data/db/…')` |

Ejemplos:

- `persona-grid-data.json` → config de la UI (labels, `dataUrl`, `storageKey`, `fields`) → local Pug `personaGridData`
- `src/data/db/persona.json` → filas seed `{ "personas": [ { nombre, edad, tutorId, … } ] }`
- `src/data/db/tutor.json` → filas seed `{ "tutores": [ { id, nombre } ] }`

### Flujo completo del emulador

```text
┌─────────────────────────────────────────────────────────────┐
│  AUTHORING (repo)                                           │
│  src/data/db/persona.json   src/data/db/tutor.json          │
│  (seed / estado inicial versionado en git)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │ gulp task `assets`
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  RUNTIME ESTÁTICO (public/ = lo que se deploya)             │
│  public/data/db/persona.json                                │
│  public/data/db/tutor.json                                  │
└───────────────────────────┬─────────────────────────────────┘
                            │ fetch() la 1ª vez
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  STORE JS  src/js/db/crudDemoStore.js                       │
│  { personas: [...], tutores: [...] }                        │
│  + createId / ensureIds / findTutorName / persistStore      │
└───────────────────────────┬─────────────────────────────────┘
                            │ si hay CRUD
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  localStorage[storageKey]  (ej. crud-demo-store-v3)          │
│  Persiste Create/Update/Delete SOLO en ESE navegador        │
│  Evento `crud-demo-store-updated` para sincronizar UIs      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  UI  src/js/modules/personaGrid.js / tutorGrid.js           │
│  Form + grilla de cards + preview JSON                      │
│  Markup en style-guide; config en *-grid-data.json          │
└─────────────────────────────────────────────────────────────┘
```

### Arranque (orden de decisión del store)

Implementado en `loadCrudStore` (`src/js/db/crudDemoStore.js`):

1. ¿Existe `localStorage[storageKey]` con forma `{ personas, tutores }`?  
   → Usarlo (rellenar `id` faltantes) y devolver `source: 'localStorage'`.
2. Si no → `fetch` en paralelo de los JSON seed (`personaUrl`, `tutorUrl`).  
   → Normalizar arrays, asegurar `id`, escribir `localStorage`, devolver el store.
3. (Migración) Si hay una key legacy de personas, puede mezclarse al seed — detalle de la demo actual.

A partir de ahí, **Create / Update / Delete** solo tocan el store + `persistStore` (localStorage + evento custom). **Nunca** reescriben los `.json` del disco ni del repo.

### Relación entre tablas (FK) — demo canónica

Ya existe un modelo Persona → Tutor:

```json
// public/data/db/tutor.json (tabla padres)
{ "tutores": [ { "id": "tutor-001", "nombre": "Roberto Sanchez" }, … ] }

// public/data/db/persona.json (tabla hijas)
{ "personas": [ { "nombre": "…", "tutorId": "tutor-001", … }, … ] }
```

- En el form de personas, `tutorId` es un `<select>` poblado desde la colección `tutores`.
- Al pintar una card, `findTutorName(tutores, persona.tutorId)` resuelve el nombre (JOIN ligero en JS).
- Ambas grillas comparten el **mismo** `storageKey` (`crud-demo-store-v3`) para que crear un tutor en una sección actualice el dropdown de la otra (vía `crud-demo-store-updated`).

### Piezas de la demo de referencia (obligatorio conocerlas)

| Pieza | Ruta |
|-------|------|
| Seed personas | `src/data/db/persona.json` |
| Seed tutores | `src/data/db/tutor.json` |
| Store / “motor BD” | `src/js/db/crudDemoStore.js` |
| UI personas | `src/js/modules/personaGrid.js` |
| UI tutores | `src/js/modules/tutorGrid.js` |
| Config UI personas | `src/data/persona-grid-data.json` |
| Config UI tutores | `src/data/tutor-grid-data.json` |
| Markup | `src/pug/style-guide/persona-grid.pug`, `tutor-grid.pug` |
| Estilos | `src/scss/modules/_persona-grid.scss`, `_tutor-grid.scss` |
| Demo en vivo | `public/style-guide.html` (tras `npm run dev` o en Pages) |

Campos típicos de config (`*-grid-data.json`):

- `dataUrl` / `tutorDataUrl` → rutas relativas `./data/db/….json`
- `storageKey` → nombre del blob en localStorage (si cambias el schema, bump a `-v2`, `-v3`, …)
- `fields` → definición del formulario (name, label, type, required, …)
- Textos de botones, mensajes, empty states

En el markup, la raíz BEM lleva `data-url`, `data-storage-key`, etc., leídos por el módulo JS.

### Modo A — Solo lectura (sin form)

Útil para listados estáticos:

```text
seed JSON → public/data/db/ → fetch → render cards/lista
```

Sin `localStorage` de escritura (o solo cache opcional). Ideal para catálogos que no se editan en la demo.

### Modo B — CRUD completo (Pages-compatible)

1. Form arriba + grilla de cards abajo (`aria-live="polite"`).
2. Cada registro tiene `id`.
3. **Create:** Submit en modo crear → append + nuevo `id`.
4. **Read:** grilla desde el store.
5. **Update:** Editar rellena el form; Submit reemplaza por `id`.
6. **Delete:** confirm + filtra por `id`.
7. Mismo código en localhost y GitHub Pages.

### Límites (hay que decirlos en cualquier prompt/spec)

| Capacidad | ¿Funciona? |
|-----------|------------|
| Ver seed inicial + grilla en Pages | Sí |
| Crear/editar/borrar y ver la grilla actualizarse | Sí, **en ese navegador** |
| Que otro visitante / otro device vea tus cambios | **No** (cada uno tiene su localStorage) |
| Que el Submit reescriba `src/data/db/*.json` en GitHub | **No** |
| Multi-usuario / auth / SQL real | **No** (fuera de alcance del emulador) |
| Funciona offline tras la 1ª carga del seed | Parcial (localStorage sí; seed necesita haberse fetcheado) |

Si el producto real necesita persistencia compartida o multi-usuario, eso es **otro sistema** (API/backend). Este emulador sirve para **prototipar UX de datos** encima del sitio estático.

### Cómo añadir una tabla nueva (receta para agentes)

1. Crear seed `src/data/db/{tabla}.json` con forma `{ "{coleccion}": [ { …filas… } ] }` (idealmente con `id` en cada fila).
2. Ampliar el store en `src/js/db/` (colecciones, load, persist, helpers FK/JOIN).
3. Crear config UI `src/data/{nombre}-grid-data.json` con `dataUrl: "./data/db/{tabla}.json"` y `storageKey` (bump si rompes schema).
4. Crear Pug + SCSS + JS UI en `modules/`; el UI **importa** el store desde `../db/…` y **no** reimplementa read/write.
5. Registrar SCSS en `modules.scss` y JS en `initComponents`.
6. Incluir el Pug en la página o style-guide.
7. Verificar: `npm run dev` → Submit crea card → reload sigue (localStorage) → `npm run deploy` misma UX en Pages.

### Qué deben asumir quienes diseñen el prompt de la app

Al especificar features de datos, escribe requisitos en este vocabulario:

- “Tabla seed `pedidos.json` en `src/data/db/` con colección `pedidos`”
- “FK `clienteId` hacia tabla `clientes`”
- “CRUD en grilla con `storageKey` compartido `choricar-store-v1`”
- “Solo lectura desde seed si no hace falta editar en la demo”
- “Sin backend; persistencia solo localStorage por navegador”

**No** escribas: “endpoint REST”, “migraciones Prisma”, “guardar en el JSON del repo al hacer Submit”, salvo que el humano cambie explícitamente de arquitectura.

---

## Tokens CSS relevantes (`:root` en `_layout.scss`)

- Layout: `--main-container`, `--container`, `--header-height`
- Breakpoints espejo: `--s` … `--xxxxl`
- Paleta: `--color-yellow`, `--color-orange`, … `--color-fuchsia`
- Botones/links: `--btn-primary`, `--btn-primary-hover`, `--btn-secondary`, `--link-color`
- Superficies: `--header-bg`, `--body-bg`, `--footer-bg`

Cambia tokens en SCSS core; no inventes max-widths de layout en parciales de módulo.

---

## Mapa de decisión (qué aplicar)

| Si vas a tocar… | Aplica estas convenciones |
|-----------------|---------------------------|
| Cualquier Sass/CSS | Breakpoints globales `@import`, hover con `(hover: hover) and (pointer: fine)`, sin Tailwind/`@use` |
| Layout / sections / módulos Pug | Shell `.main-container` > `.container`, BEM |
| Nuevo componente Pug+SCSS(+JS) | Simetría de nombres + flujo “crear componente” |
| Plantillas Pug | Sintaxis larga + datos en `*-data.json` |
| Sliders | Convención `*-slider` + Swiper CDN + módulo `*Slider.js` |
| JS en `src/js` | camelCase, multi-instancia, `dataset.*Ready`, init en `index.js` |
| Grilla / form fake / fetch seed | Seeds en `data/db/`, UI en modules, store en `js/db/` |
| Emulación BD / FK / JOIN | Solo `src/js/db/` + `src/data/db/` |
| Publicar CSS/JS | `npm run build` (bump `assetVersion`) |
| Publicar a Pages | `npm run deploy` |

Si la tarea cruza capas (p. ej. slider nuevo), aplica **todas** las filas relevantes antes del primer edit.

---

## Catálogo de rules (contenido completo embebido)

Estas rules viven en `.cursor/rules/*.mdc`. Aquí está su contenido normativo para que no haga falta abrirlas.

### `review-rules-skills` (alwaysApply)

Antes de implementar: identificar convenciones aplicables (este README) y solo entonces editar. No omitir Sass/`@import`, hover pointer fino, shell layout, simetría, Pug largo, datos JSON, módulos JS, JSON estático, emulación BD.

### `pug-long-syntax`

Sintaxis Pug explícita con `class=`; prohibido shorthand Emmet; BEM + shell; sin Tailwind.

### `pug-data-files`

Datos dinámicos en `src/data/*-data.json`; local camelCase; `.pug` solo markup; UI en `components/`, specimens en `style-guide/`, páginas en `pages/`; seeds BD en `src/data/db/`.

### `javascript-modules`

Módulos en `src/js/modules/`; camelCase; multi-instancia; `dataset.*Ready`; Swiper CDN; BD en `src/js/db/`; registro en `initComponents`.

### `bem-module-layout`

Cada módulo: bloque BEM + `.main-container` + `.container`; tokens en `:root`; sin frameworks; no duplicar shell dentro del style-guide si el padre ya lo aporta.

### `component-symmetry`

Misma base de nombre en Pug/SCSS/JS/JSON/BEM; registrar SCSS y JS; sin `@use`/Tailwind.

### `sass-breakpoints`

Único entry `styles.scss`; primero `@import` breakpoints; variables `$s`…`$xxxxl`; registrar parciales en `modules.scss`; sin `@use`/`@forward`.

### `sass-hover-touch`

Todo `:hover` dentro de `@media (hover: hover) and (pointer: fine)`; `:focus-visible` para teclado.

### `static-json-data`

Patrón seed fetch ± form/localStorage/CRUD; referencia `persona-grid`; mismos límites Pages; `data-url` + `data-storage-key`.

### `emulated-db`

Seeds en `src/data/db/`; lógica store en `src/js/db/`; UI en `modules/`; config en `*-grid-data.json`; sin API write en Gulp.

---

## Catálogo de skills (contenido completo embebido)

Skills en `.cursor/skills/*/SKILL.md`. Resumen operativo equivalente:

| Skill | Cuándo | Acción |
|-------|--------|--------|
| `review-rules-skills` | Toda tarea | Checklist + mapa de decisión de este README |
| `layout-containers` | Crear/editar módulos Pug | Shell BEM + main-container + container |
| `pug-long-syntax` | Cualquier Pug | Atributo `class` explícito |
| `create-component` | Scaffold componente | JSON → Pug → SCSS → register → JS opcional → include |
| `create-slider-data` | Sliders | Pareja pug/json/scss/js Swiper CDN |
| `create-static-json-module` | Grillas/forms fake | Seed db + config + pug + scss + UI + store |
| `emulated-db` | Tablas/store/FK | Seeds `data/db` + JS `js/db` |
| `bump-assets` | Publicar assets | Dejar que `npm run build` incremente `assetVersion` |

---

## Checklist anti-errores (antes de dar por terminado un cambio)

- [ ] ¿Pug con `tag(class='…')` y no shorthand?
- [ ] ¿Shell `.main-container` > `.container` (salvo excepción style-guide)?
- [ ] ¿Datos listados en `src/data/*-data.json`, no inline?
- [ ] ¿SCSS con `@import` (no `@use`) y registrado en `modules.scss`?
- [ ] ¿Media queries con `$sm` / `$l` / etc.?
- [ ] ¿Hover envuelto en `(hover: hover) and (pointer: fine)`?
- [ ] ¿Sin clases ni hábitos Tailwind?
- [ ] ¿JS camelCase, multi-instancia, `dataset.*Ready`, registrado en `initComponents`?
- [ ] ¿Swiper solo por CDN?
- [ ] ¿Seeds de tabla en `src/data/db/` y store en `src/js/db/`?
- [ ] ¿Sin inventar endpoint Gulp que escriba JSON?
- [ ] ¿Simetría de nombres Pug/SCSS/JS/JSON/BEM?
- [ ] Si se publica: `npm run build` / `npm run deploy` y `homepage` = choricar

---

## Prohibiciones absolutas

1. Tailwind / utility-first en markup o SCSS  
2. `@use` / `@forward` en Sass  
3. Shorthand Pug Emmet (`section.foo`, `.bar`)  
4. Datos grandes inline en Pug / `*-data.pug` / `src/pug/data/`  
5. Swiper (u otras libs de UI) por npm si ya van por CDN  
6. `:hover` fuera de la media query de pointer fino  
7. Mezclar lógica de store/JOIN en `src/js/modules/` (va en `src/js/db/`)  
8. Seeds de tablas en la raíz de `src/data/` (van en `src/data/db/`)  
9. API de escritura de archivos en Gulp para demos CRUD  
10. Hardcodear `?v=` o editar `assetVersion` a mano salvo hotfix  
11. Editar `public/` como fuente (es output)  
12. Otros lockfiles distintos de `package-lock.json`

---

## Requirements y notas operativas

- Node.js `>= 22.13.1`
- `npm install` con el lockfile del repo
- Dev: http://localhost:3000
- Markdown en Pug vía `jstransformer-markdown-it`
- Overrides de seguridad en `package.json` pinnean `markdown-it` / `linkify-it`
- Producción minifica HTML/CSS/JS y omite sourcemaps

---

## Identidad del proyecto (deploy)

| Campo | Valor |
|-------|-------|
| npm `name` | `choricar` |
| `homepage` | `https://kikeestradadev.github.io/choricar/` |
| Remote esperado | `https://github.com/kikeestradadev/choricar.git` |
| Comando publish | `npm run deploy` |

Cualquier documentación, `homepage`, links de demo o referencias al boilerplate antiguo deben usar **choricar**, no nombres legacy (`gulp-boilerplate-*`, etc.).
