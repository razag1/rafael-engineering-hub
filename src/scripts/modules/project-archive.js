import { projects } from "../data/projects.js";

const githubEndpoint = "https://api.github.com/users/razag1/repos?per_page=100";
const cipherPyCover = new URL("../../assets/projects/cipherpy/preview.webp", import.meta.url).href;

const projectImages = {
    "aurora-cafe": new URL("../../assets/projects/aurora-cafe/preview.webp", import.meta.url).href,
    "cipherpy": cipherPyCover,
    "projeto-6": new URL("../../assets/projects/projeto-6/preview.png", import.meta.url).href
};

const projectLabels = {
    en: {
        status: "Status",
        stack: "Stack",
        year: "Year",
        github: "GitHub",
        liveDemo: "Live Demo",
        publicStatus: "Public",
        publicRepository: "Public GitHub repository."
    },
    pt: {
        status: "Status",
        stack: "Stack",
        year: "Ano",
        github: "GitHub",
        liveDemo: "Ver site",
        publicStatus: "Público",
        publicRepository: "Repositório público no GitHub."
    }
};

const projectTopicLabels = {
    pt: {
        "Responsive Layout": "Layout responsivo",
        "Logic": "Lógica",
        "Algorithms": "Algoritmos",
        "Web Development": "Desenvolvimento web"
    }
};

function getCurrentLanguage() {
    return localStorage.getItem("portfolioLanguage") || "en";
}

function getLabels() {
    return projectLabels[getCurrentLanguage()] || projectLabels.en;
}

function getLocalizedValue(value) {
    if (typeof value === "string") return value;
    return value?.[getCurrentLanguage()] || value?.en || "";
}

function getProjectDescription(project, githubRepository, labels) {
    const language = getCurrentLanguage();

    if (project.description?.[language]) {
        return project.description[language];
    }

    if (typeof project.fallbackDescription === "object" && project.fallbackDescription[language]) {
        return project.fallbackDescription[language];
    }

    if (githubRepository?.description) {
        return githubRepository.description;
    }

    if (typeof project.fallbackDescription === "string") {
        return project.fallbackDescription;
    }

    return labels.publicRepository;
}

function getTopicLabel(topic) {
    return projectTopicLabels[getCurrentLanguage()]?.[topic] || topic;
}

function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function normalizeRepositoryName(name) {
    return String(name).toLowerCase().replaceAll("_", "-");
}

function getFallbackRepositoryUrl(project) {
    return `https://github.com/razag1/${encodeURIComponent(project.repo)}`;
}

function getSafeRepositoryUrl(project, repository) {
    const fallbackUrl = getFallbackRepositoryUrl(project);
    if (!repository?.html_url) return fallbackUrl;

    try {
        const url = new URL(repository.html_url);
        return url.protocol === "https:" && url.hostname === "github.com" ? url.href : fallbackUrl;
    } catch {
        return fallbackUrl;
    }
}

function getLocalProjects() {
    return projects.map(function (project) {
        return {
            ...project,
            image: projectImages[project.id] || cipherPyCover,
            repositoryUrl: getFallbackRepositoryUrl(project)
        };
    }).sort(function (a, b) {
        return a.order - b.order;
    });
}

function createGitHubProject(repository, order) {
    const language = repository.language ? [repository.language] : [];
    const topics = Array.isArray(repository.topics) && repository.topics.length
        ? repository.topics
        : language.length ? language : ["GitHub"];
    const date = repository.created_at || repository.updated_at || "";

    return {
        id: normalizeRepositoryName(repository.name),
        repo: repository.name,
        order,
        featured: false,
        title: repository.name.replaceAll(/[-_]+/g, " "),
        status: {
            en: projectLabels.en.publicStatus,
            pt: projectLabels.pt.publicStatus
        },
        year: date.slice(0, 4) || "—",
        stack: language.length ? language : ["Repository"],
        topics,
        description: repository.description ? {
            en: repository.description,
            pt: repository.description
        } : {
            en: projectLabels.en.publicRepository,
            pt: projectLabels.pt.publicRepository
        },
        image: cipherPyCover,
        demoUrl: "",
        repositoryUrl: getSafeRepositoryUrl({ repo: repository.name }, repository)
    };
}

export async function getProjectsWithGitHubData(fetchImplementation = fetch) {
    const localProjects = getLocalProjects();
    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, 5000);

    try {
        const response = await fetchImplementation(githubEndpoint, {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

        const repositories = await response.json();
        if (!Array.isArray(repositories)) throw new Error("GitHub API returned an unexpected response");

        const repositoriesByName = new Map(repositories.map(function (repository) {
            return [normalizeRepositoryName(repository.name), repository];
        }));
        const curatedNames = new Set(localProjects.map(function (project) {
            return normalizeRepositoryName(project.repo);
        }));

        const curatedProjects = localProjects.map(function (project) {
            const repository = repositoriesByName.get(normalizeRepositoryName(project.repo));
            return {
                ...project,
                githubRepository: repository,
                repositoryUrl: getSafeRepositoryUrl(project, repository)
            };
        });

        const extraProjects = repositories.filter(function (repository) {
            return !curatedNames.has(normalizeRepositoryName(repository.name));
        }).sort(function (a, b) {
            return a.name.localeCompare(b.name);
        }).map(function (repository, index) {
            return createGitHubProject(repository, curatedProjects.length + index + 1);
        });

        return [...curatedProjects, ...extraProjects];
    } catch {
        return localProjects;
    } finally {
        clearTimeout(timeoutId);
    }
}

function createProjectCard(project, variant) {
    const labels = getLabels();
    const article = document.createElement("article");
    article.className = `project-card project-card--${variant} project-card--open`;
    const demoAction = project.demoUrl ? `
        <a class="btn btn-primary" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(labels.liveDemo)}
        </a>` : "";

    article.innerHTML = `
        <button class="project-card__header" type="button" aria-expanded="true">
            <span class="project-card__title">${escapeHtml(project.title)}</span>
            <span class="project-card__icon">-</span>
        </button>
        <div class="project-card__body">
            <div class="project-card__content">
                <div class="project-card__layout">
                    <img class="project-card__image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async" width="320" height="180">
                    <div class="project-card__info">
                        <p class="project-card__text">${escapeHtml(getProjectDescription(project, project.githubRepository, labels))}</p>
                        <div class="project-card__meta">
                            <span>${escapeHtml(labels.status)}: ${escapeHtml(getLocalizedValue(project.status))}</span>
                            <span>${escapeHtml(labels.stack)}: ${escapeHtml(project.stack.join(", "))}</span>
                            <span>${escapeHtml(labels.year)}: ${escapeHtml(project.year)}</span>
                        </div>
                    </div>
                </div>
                <div class="project-card__footer">
                    <div class="project-card__tags">
                        ${project.topics.map(function (topic) { return `<span>${escapeHtml(getTopicLabel(topic))}</span>`; }).join("")}
                    </div>
                    <div class="project-card__actions">
                        <a class="btn btn-outline-primary" href="${escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(labels.github)}</a>
                        ${demoAction}
                    </div>
                </div>
            </div>
        </div>`;

    const header = article.querySelector(".project-card__header");
    const icon = article.querySelector(".project-card__icon");
    header.addEventListener("click", function () {
        article.classList.toggle("project-card--open");
        const isOpen = article.classList.contains("project-card--open");
        icon.textContent = isOpen ? "-" : "+";
        header.setAttribute("aria-expanded", isOpen.toString());
        header.blur();
    });

    return article;
}

function renderProjects(container, items, variant) {
    container.innerHTML = "";
    items.forEach(function (project) { container.appendChild(createProjectCard(project, variant)); });
}

function getFeaturedProjects(items) {
    return items.filter(function (project) { return project.featured; })
        .sort(function (a, b) { return a.order - b.order; }).slice(0, 3);
}

export async function setupProjectArchive() {
    const archiveList = document.querySelector("[data-projects-list]");
    const featuredList = document.querySelector("[data-featured-projects]");
    if (!archiveList && !featuredList) return;

    let currentProjects = getLocalProjects();

    function renderProjectsAgain() {
        if (archiveList) renderProjects(archiveList, currentProjects, "grid");
        if (featuredList) renderProjects(featuredList, getFeaturedProjects(currentProjects), "featured");
    }

    renderProjectsAgain();
    document.addEventListener("portfolio:language-change", renderProjectsAgain);

    currentProjects = await getProjectsWithGitHubData();
    renderProjectsAgain();
}
