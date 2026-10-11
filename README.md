# 🖥️ Rafael Engineering Hub

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![SCSS](https://img.shields.io/badge/SCSS-CC6699)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)

**Rafael Engineering Hub** is my personal portfolio project, built to present my technical evolution, projects, certificates, and learning journey in a structured and professional way.

The project is designed as a **retro-inspired engineering hub**, using a visual concept based on classic Windows 95/98 interfaces. The goal is to combine personality, readability, and technical organization without compromising usability or responsiveness.

---

## 📑 Table of Contents

- [About](#-about)
- [Visual Concept](#-visual-concept)
- [Technologies](#-technologies)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Projects Data Structure](#projects-data-structure)
- [Running Locally](#-running-locally)
- [Image Optimization](#-image-optimization)
- [Status & Roadmap](#-status--roadmap)
- [Author](#-author)

---

## 👤 About

I'm **Rafael Zaparolli**, a Full Stack Python student at EBAC and future Software Engineering student. My main focus is backend development, Python, programming logic, databases, and — eventually — software architecture.

This portfolio was created to present my work to recruiters, tech recruiters, professors, colleagues, and evaluators for internship or junior developer positions.

## 🪟 Visual Concept

The interface follows a classic operating system aesthetic, with sections presented as windows and files, such as:

| File | Section |
|---|---|
| `profile.exe` | About me |
| `system-info.ini` | System / personal info card |
| `projects.exe` | Projects showcase |
| `journey.log` | Learning journey |
| `certificates.exe` | Certificates |

The design aims to feel **technical, organized, nostalgic, and professional**.

## 🛠️ Technologies

- HTML
- SCSS
- JavaScript
- Bootstrap
- Parcel
- Devicon
- Sharp (image optimization)

## ✨ Features

**Available**
- Responsive layout for desktop, tablet, and mobile devices
- Retro window-based interface
- Interactive project cards
- Interactive system information card
- Optimized images using WebP
- Certificate preview on the home page

**Planned**
- Dedicated project and certificate pages
- PT-BR / EN language toggle
- Certificate modal

## 📁 Project Structure

```txt
src/
  assets/
    certificates/
    img/
    preview/
    projects/
  scripts/
    main.js
    data/
    modules/
  styles/
    _about.scss
    _base.scss
    _buttons.scss
    _certificates.scss
    _journey.scss
    _page.scss
    _projects.scss
    _responsive.scss
    _skills.scss
    _system-card.scss
    _variables.scss
    _window.scss
    main.scss
  index.html
  projetos.html
  certificados.html
tools/
  optimize-images.js
```

## Projects Data Structure

Projects are organized with metadata in:

```txt
src/scripts/data/projects.js
```

Project images should follow this structure:

```txt
src/assets/projects/project-id/preview.webp
src/assets/projects/project-id/preview.png
```

Each project entry should include:

```txt
id, title, status, year, stack, topics, summary, image, repositoryUrl, demoUrl
```

## 🚀 Running Locally

**1. Clone the repository**

```bash
git clone https://github.com/razag1/rafael-engineering-hub.git
cd rafael-engineering-hub
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

The project will be available at:

```txt
http://localhost:1234
```

## 🖼️ Image Optimization

The project uses [Sharp](https://sharp.pixelplumbing.com/) to generate optimized WebP images.

```bash
npm run optimize:images
```

## 📌 Status & Roadmap

The **Home** page is currently under development and refinement.

Current focus:

- [ ] Finalizing Home responsiveness
- [ ] Adding PT-BR / EN translation
- [ ] Creating the certificate modal
- [ ] Building `projetos.html`
- [ ] Building `certificados.html`
- [ ] Adding real project links
- [ ] Publishing on Vercel

## 👨‍💻 Author

**Rafael Zaparolli**

- GitHub: [@razag1](https://github.com/razag1)
- LinkedIn: [Rafael Zaparolli de Agustini](https://www.linkedin.com/in/rafael-zaparolli-de-agustini-09a8871a9/)
