import { certificates } from "../data/certificates.js";
import { translations } from "../data/translations.js";

const topicLabels = {
    en: {
        Python: "Python",
        "Programming Logic": "Programming Logic",
        Databases: "Databases",
        "Web Development": "Web Development",
        "IT Fundamentals": "IT Fundamentals",
        Design: "Design",
        Ethics: "Ethics",
        Automation: "Automation",
        "Software Engineering": "Software Engineering",
        "Artificial Intelligence": "Artificial Intelligence",
    },
    pt: {
        Python: "Python",
        "Programming Logic": "Lógica de Programação",
        Databases: "Banco de Dados",
        "Web Development": "Desenvolvimento Web",
        "IT Fundamentals": "Fundamentos de TI",
        Design: "Design",
        Ethics: "Ética",
        Automation: "Automação",
        "Software Engineering": "Engenharia de Software",
        "Artificial Intelligence": "Inteligência Artificial",
    },
};

function getCurrentLanguage() {
    return localStorage.getItem("portfolioLanguage") || "en";
}

function getCertificateTitle(certificate) {
    const language = getCurrentLanguage();
    return translations[language]?.[certificate.titleKey] || certificate.title;
}

function getFilterIssuer(certificate) {
    return certificate.filterIssuer || certificate.issuer;
}

function getTopicLabel(topic) {
    const language = getCurrentLanguage();
    return topicLabels[language]?.[topic] || topic;
}

function getUiLabels() {
    const language = getCurrentLanguage();

    return {
        toConfirm: translations[language]?.["certificatesArchive.toConfirm"] || "To confirm",
        certificatesFound:
            translations[language]?.["certificatesArchive.certificatesFound"] ||
            "certificate(s) found.",
        viewCertificate:
            translations[language]?.["certificatesArchive.viewCertificate"] || "View Certificate",
    };
}

function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

function getUniqueValues(items, getter) {
    return [...new Set(items.flatMap(getter))].sort(function (a, b) {
        return a.localeCompare(b);
    });
}

function formatYear(year) {
    return year === "unknown" ? getUiLabels().toConfirm : year;
}

function formatCompletedAt(completedAt) {
    return completedAt === "To confirm" ? getUiLabels().toConfirm : completedAt;
}

function createCertificateCard(certificate, variant) {
    const isArchiveCard = variant === "archive";
    const titleText = getCertificateTitle(certificate);
    const completedAt = formatCompletedAt(certificate.completedAt);
    const article = document.createElement("article");
    article.className = isArchiveCard
        ? "certificate-card certificate-card--archive"
        : "certificate-card";
    article.dataset.year = certificate.year;
    article.dataset.issuer = certificate.issuer;
    article.dataset.issuerGroup = getFilterIssuer(certificate);
    article.dataset.topics = certificate.topics.join(",");

    const issuer = document.createElement("span");
    issuer.className = "certificate-card__issuer";
    issuer.textContent = certificate.issuer;

    const title = document.createElement(isArchiveCard ? "h2" : "h3");
    title.className = "certificate-card__title";
    title.textContent = titleText;

    const metadata = document.createElement("p");
    metadata.className = "certificate-card__meta";
    metadata.textContent = isArchiveCard
        ? `${certificate.hours} · ${completedAt}`
        : `${certificate.hours} · ${formatYear(certificate.year)}`;

    const image = document.createElement("img");
    image.className = "certificate-card__image";
    image.src = certificate.image;
    image.alt = `Certificate ${titleText} - ${certificate.issuer}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 260;
    image.height = 160;

    const button = document.createElement("button");
    button.className = "btn btn-outline-primary certificate-card__link";
    button.type = "button";
    button.dataset.certificateModal = "";
    button.dataset.certificateTitle = titleText;
    button.dataset.certificateIssuer = certificate.issuer;
    button.dataset.certificateHours = certificate.hours;
    button.dataset.certificateDate = isArchiveCard ? completedAt : formatYear(certificate.year);
    button.dataset.certificateImage = certificate.image;
    button.dataset.i18n = "buttons.viewCertificate";
    button.textContent = getUiLabels().viewCertificate;

    article.append(issuer, title, metadata, image);

    if (isArchiveCard) {
        const tags = document.createElement("div");
        tags.className = "certificate-card__tags";
        certificate.topics.forEach(function (topic) {
            const tag = document.createElement("span");
            tag.textContent = getTopicLabel(topic);
            tags.appendChild(tag);
        });
        article.appendChild(tags);
    }

    article.appendChild(button);
    return article;
}

function renderCertificates(listElement, items, variant) {
    listElement.replaceChildren();
    const fragment = document.createDocumentFragment();

    items.forEach(function (certificate) {
        fragment.appendChild(createCertificateCard(certificate, variant));
    });

    listElement.appendChild(fragment);
}

function getFeaturedCertificates() {
    return certificates
        .filter(function (certificate) {
            return Number.isInteger(certificate.featuredOrder);
        })
        .sort(function (first, second) {
            return first.featuredOrder - second.featuredOrder;
        });
}

function populateFilters(yearFilter, issuerFilter, topicFilter) {
    const years = getUniqueValues(certificates, function (certificate) {
        return [certificate.year];
    });
    const issuers = getUniqueValues(certificates, function (certificate) {
        return [getFilterIssuer(certificate)];
    });
    const topics = getUniqueValues(certificates, function (certificate) {
        return certificate.topics;
    });

    years.forEach(function (year) {
        yearFilter.appendChild(createOption(year, formatYear(year)));
    });
    issuers.forEach(function (issuer) {
        issuerFilter.appendChild(createOption(issuer, issuer));
    });
    topics.forEach(function (topic) {
        topicFilter.appendChild(createOption(topic, getTopicLabel(topic)));
    });
}

function getFilteredCertificates(year, issuer, topic) {
    return certificates.filter(function (certificate) {
        const matchesYear = year === "all" || certificate.year === year;
        const matchesIssuer = issuer === "all" || getFilterIssuer(certificate) === issuer;
        const matchesTopic = topic === "all" || certificate.topics.includes(topic);
        return matchesYear && matchesIssuer && matchesTopic;
    });
}

export function setupCertificateArchive() {
    const archive = document.querySelector("[data-certificate-archive]");
    const featuredList = document.querySelector("[data-featured-certificates]");

    if (!archive && !featuredList) {
        return;
    }

    function renderFeaturedCertificates() {
        if (featuredList) {
            renderCertificates(featuredList, getFeaturedCertificates(), "featured");
        }
    }

    if (!archive) {
        renderFeaturedCertificates();
        document.addEventListener("portfolio:language-change", renderFeaturedCertificates);
        return;
    }

    const listElement = archive.querySelector("[data-certificates-list]");
    const yearFilter = archive.querySelector("[data-filter-year]");
    const issuerFilter = archive.querySelector("[data-filter-issuer]");
    const topicFilter = archive.querySelector("[data-filter-topic]");
    const countElement = archive.querySelector("[data-certificates-count]");
    const emptyElement = archive.querySelector("[data-certificates-empty]");

    if (
        !listElement ||
        !yearFilter ||
        !issuerFilter ||
        !topicFilter ||
        !countElement ||
        !emptyElement
    ) {
        renderFeaturedCertificates();
        return;
    }

    function refreshFilterLabels() {
        const selectedYear = yearFilter.value || "all";
        const selectedIssuer = issuerFilter.value || "all";
        const selectedTopic = topicFilter.value || "all";
        const language = getCurrentLanguage();

        yearFilter.replaceChildren();
        issuerFilter.replaceChildren();
        topicFilter.replaceChildren();

        yearFilter.appendChild(
            createOption(
                "all",
                translations[language]?.["certificatesArchive.allYears"] || "All years",
            ),
        );
        issuerFilter.appendChild(
            createOption(
                "all",
                translations[language]?.["certificatesArchive.allInstitutions"] ||
                    "All institutions",
            ),
        );
        topicFilter.appendChild(
            createOption(
                "all",
                translations[language]?.["certificatesArchive.allTopics"] || "All areas and tools",
            ),
        );

        populateFilters(yearFilter, issuerFilter, topicFilter);
        yearFilter.value = selectedYear;
        issuerFilter.value = selectedIssuer;
        topicFilter.value = selectedTopic;
    }

    function updateArchive() {
        const filteredCertificates = getFilteredCertificates(
            yearFilter.value,
            issuerFilter.value,
            topicFilter.value,
        );

        renderCertificates(listElement, filteredCertificates, "archive");
        countElement.textContent = `${filteredCertificates.length} ${getUiLabels().certificatesFound}`;
        emptyElement.hidden = filteredCertificates.length > 0;
    }

    function handleLanguageChange() {
        renderFeaturedCertificates();
        refreshFilterLabels();
        updateArchive();
    }

    refreshFilterLabels();
    renderFeaturedCertificates();
    updateArchive();
    yearFilter.addEventListener("change", updateArchive);
    issuerFilter.addEventListener("change", updateArchive);
    topicFilter.addEventListener("change", updateArchive);
    document.addEventListener("portfolio:language-change", handleLanguageChange);
}
