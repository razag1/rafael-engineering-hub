# Rafael Engineering Hub

> A retro-inspired personal portfolio showcasing Software Engineering, backend development, projects, certifications, and continuous learning.

[![Quality](https://github.com/razag1/rafael-engineering-hub/actions/workflows/quality.yml/badge.svg)](https://github.com/razag1/rafael-engineering-hub/actions/workflows/quality.yml)

## Overview

Rafael Engineering Hub is a multipage personal portfolio inspired by classic Windows 95/98 interfaces. It presents a technical profile, learning journey, selected projects, and professional certificates while preserving responsive behavior, keyboard access, and a clear content hierarchy.

The current public deployment is available at [rafael-engineering-hub.vercel.app](https://rafael-engineering-hub.vercel.app). Changes from this branch will only be reflected there after the corresponding deployment succeeds.

## About

Rafael Zaparolli is pursuing a Software Engineering degree and studying Full Stack Python at EBAC. His primary interests are backend development, Python, databases, programming logic, and software architecture.

## Features

- Responsive retro desktop interface for desktop, tablet, and mobile screens
- Three-page navigation with shared styling and JavaScript modules
- English and Brazilian Portuguese content with persisted language preference
- Curated project data enriched with public GitHub repository information
- Local project fallback when the GitHub API is unavailable or rate-limited
- Searchable certificate archive with year, institution, and topic filters
- Keyboard-accessible certificate viewer with zoom, drag, focus trapping, Escape close, and focus restoration
- Optimized WebP images generated from preserved source assets
- Automated lint, formatting, tests, smoke checks, build, and CI

The interface intentionally uses a light color scheme. Dark mode is not currently implemented.

## Pages

| Page         | Source                  | Purpose                                                                         |
| ------------ | ----------------------- | ------------------------------------------------------------------------------- |
| Home         | `src/index.html`        | Profile, skills, learning journey, featured projects, and featured certificates |
| Projects     | `src/projetos.html`     | Curated projects plus public GitHub repositories                                |
| Certificates | `src/certificados.html` | Complete certificate catalog, filters, and certificate viewer                   |

## Tech stack

- HTML5
- SCSS with BEM-oriented component naming
- JavaScript ES modules
- Bootstrap 5
- Parcel 2
- Sharp for image processing
- Vitest and jsdom for automated tests
- ESLint and Prettier for code quality
- GitHub Actions for continuous integration
- Vercel for deployment

Devicon 2.16.0 is loaded from jsDelivr for technology icons.

## Architecture

```text
.
├── .github/workflows/quality.yml   # clean install and quality pipeline
├── src/
│   ├── index.html                  # home entry point
│   ├── projetos.html               # projects entry point
│   ├── certificados.html           # certificates entry point
│   ├── robots.txt
│   ├── assets/
│   │   ├── certificates/           # certificate source images and WebP files
│   │   ├── img/profile/            # profile source image and WebP file
│   │   ├── projects/               # project covers and optimized variants
│   │   └── resume/                 # public résumé linked from the home page
│   ├── scripts/
│   │   ├── main.js                 # non-blocking application initialization
│   │   ├── data/
│   │   │   ├── certificates.js     # certificate catalog
│   │   │   ├── projects.js         # curated project metadata
│   │   │   └── translations.js     # PT-BR and EN strings
│   │   └── modules/
│   │       ├── accordion.js
│   │       ├── certificate-archive.js
│   │       ├── certificate-modal.js
│   │       ├── click-blur.js
│   │       ├── language.js
│   │       └── project-archive.js
│   └── styles/
│       ├── main.scss               # Bootstrap and local module entry point
│       └── _*.scss                 # foundations, layouts, and components
├── tests/                          # unit, integration, accessibility, and page smoke tests
├── tools/optimize-images.js        # recursive Sharp/WebP workflow
├── eslint.config.mjs
├── vitest.config.mjs
├── .prettierrc.json
├── .nvmrc
├── package.json
├── package-lock.json
└── vercel.json
```

The three HTML files are Parcel entry points. Each imports `styles/main.scss` and `scripts/main.js`. Modules use feature detection so the shared entry point can initialize only the components present on a page.

## Installation

### Requirements

- Node.js 24.x (recommended)
- npm 11 or newer

```bash
git clone https://github.com/razag1/rafael-engineering-hub.git
cd rafael-engineering-hub
npm ci
npm run dev
```

Parcel serves the project at `http://localhost:1234` by default.

### Available scripts

| Command                   | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | Start the Parcel development server for all three pages |
| `npm run build`           | Generate the production bundle in `dist/`               |
| `npm run optimize:images` | Generate WebP images from JPG, JPEG, and PNG sources    |
| `npm run lint`            | Run ESLint                                              |
| `npm run format`          | Check formatting with Prettier                          |
| `npm run format:write`    | Apply the configured Prettier style                     |
| `npm test`                | Run the Vitest suite once                               |
| `npm run test:watch`      | Run Vitest in watch mode                                |
| `npm run check`           | Run lint, formatting, tests, and production build       |

## Projects

Curated metadata lives in `src/scripts/data/projects.js`. The project module renders this local catalog immediately, then requests the public repositories for [`razag1`](https://github.com/razag1) from the GitHub API.

The integration validates repository URLs, rejects malformed responses, applies a five-second timeout, avoids blocking unrelated page interactions, and falls back to the local catalog on HTTP, network, timeout, or rate-limit failures. Featured projects remain controlled by local metadata.

## Certificates

`src/scripts/data/certificates.js` contains certificate metadata such as institution, completion date, duration, topics, and image path. The certificates page renders cards with DOM APIs and supports filters for year, institution, and topic.

The shared modal supports:

- opening from home or archive cards;
- zoom in, zoom out, and reset;
- mouse dragging of enlarged images;
- Escape to close;
- Tab and Shift+Tab focus containment;
- focus return to the button that opened it.

## Internationalization

English and Brazilian Portuguese strings are maintained in `src/scripts/data/translations.js`. Elements opt in through `data-i18n` and accessible labels through `data-i18n-aria-label`.

The selected language is stored in `localStorage` under `portfolioLanguage`, applied to `document.documentElement.lang`, and propagated to dynamic project and certificate content through the `portfolio:language-change` event.

## Images

Run the following command after adding or updating JPG, JPEG, or PNG assets:

```bash
npm run optimize:images
```

`tools/optimize-images.js` recursively scans `src/assets`, limits image width by asset category, and writes quality-80 WebP files next to their source images. Source files used by this workflow are intentionally preserved.

## Deployment

`vercel.json` runs `npm run build` and publishes `dist/`. The configured public deployment was reachable when this documentation was updated; availability does not imply that changes from this branch have already been deployed:

- [https://rafael-engineering-hub.vercel.app](https://rafael-engineering-hub.vercel.app)

## Quality

The repository includes:

- ESLint rules for browser modules, Node.js tools, and tests;
- Prettier checks for source, configuration, tests, and documentation;
- Vitest/jsdom regression coverage for language persistence, certificate filtering, modal keyboard behavior, GitHub fallback, URL validation, and all three HTML entries;
- GitHub Actions running `npm ci` and `npm run check` on pushes to `main` and pull requests;
- a pinned Node.js major version through `.nvmrc` and `package.json#engines`.

## Roadmap

- Add end-to-end browser coverage for responsive navigation and modal gestures
- Consider visual regression snapshots for the retro interface
- Expand curated project descriptions and imagery as projects mature
- Revisit Bootstrap Sass deprecation warnings when the upstream package completes its module-system migration
- Periodically review the public résumé and certificate assets for privacy and freshness

## Suggested GitHub topics

`portfolio`, `software-engineering`, `backend-development`, `javascript`, `scss`, `bootstrap`, `parcel`, `accessibility`, `responsive-design`, `python`

## Author

**Rafael Zaparolli**

- GitHub: [@razag1](https://github.com/razag1)
- LinkedIn: [Rafael Zaparolli de Agustini](https://www.linkedin.com/in/rafael-zaparolli-de-agustini-09a8871a9/)

<details>
<summary>Resumo em português</summary>

O Rafael Engineering Hub é um portfólio pessoal multipágina inspirado nas interfaces do Windows 95/98. O projeto apresenta perfil técnico, jornada de estudos, projetos e certificados, com layout responsivo, alternância entre português e inglês, integração resiliente com a API pública do GitHub e navegação acessível por teclado.

Para executar localmente, recomenda-se Node.js 24.x, `npm ci` e `npm run dev`. O comando `npm run check` executa lint, verificação de formatação, testes automatizados e build de produção.

</details>
