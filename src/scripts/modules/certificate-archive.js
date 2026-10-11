import { certificates } from "../data/certificates.js";
import { translations } from "../data/translations.js";

const topicLabels = {
    en: {
        "Python": "Python",
        "Programming Logic": "Programming Logic",
        "Databases": "Databases",
        "Web Development": "Web Development",
        "IT Fundamentals": "IT Fundamentals",
        "Design": "Design",
        "Ethics": "Ethics",
        "Automation": "Automation"
    },
    pt: {
        "Python": "Python",
        "Programming Logic": "Lógica de Programação",
        "Databases": "Banco de Dados",
        "Web Development": "Desenvolvimento Web",
        "IT Fundamentals": "Fundamentos de TI",
        "Design": "Design",
        "Ethics": "Ética",
        "Automation": "Automação"
    }
};

function getCurrentLanguage() {
    return localStorage.getItem("portfolioLanguage") || "en";
}

function getTopicLabel(topic) {
    const language = getCurrentLanguage();

    return topicLabels[language]?.[topic] || topic;
}

function getUiLabels() {
    const language = getCurrentLanguage();

    return {
        toConfirm: translations[language]?.["certificatesArchive.toConfirm"] || "To confirm",
        certificatesFound: translations[language]?.["certificatesArchive.certificatesFound"] || "certificate(s) found.",
        viewCertificate: translations[language]?.["certificatesArchive.viewCertificate"] || "View Certificate"
    };
}

function normalize(value) {
    return value.toString().trim().toLowerCase();
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
    const labels = getUiLabels();

    return year === "unknown" ? labels.toConfirm : year;
}

function formatCompletedAt(completedAt) {
    const labels = getUiLabels();

    return completedAt === "To confirm" ? labels.toConfirm : completedAt;
}

function createCertificateCard(certificate) {
    const labels = getUiLabels();
    const completedAt = formatCompletedAt(certificate.completedAt);
    const article = document.createElement("article");
    article.className = "certificate-card certificate-card--archive";
    article.dataset.year = certificate.year;
    article.dataset.issuer = certificate.issuer;
    article.dataset.topics = certificate.topics.join(",");

    article.innerHTML = `
        <span class="certificate-card__issuer">${certificate.issuer}</span>

        <h2 class="certificate-card__title">${certificate.title}</h2>

        <p class="certificate-card__meta">
            ${certificate.hours} · ${completedAt}
        </p>

        <img
            src="${certificate.image}"
            alt="Certificate ${certificate.title} - ${certificate.issuer}"
            class="certificate-card__image"
            loading="lazy"
            decoding="async"
            width="260"
            height="160"
        >

        <div class="certificate-card__tags">
            ${certificate.topics.map(function (topic) {
                return `<span>${getTopicLabel(topic)}</span>`;
            }).join("")}
        </div>

        <button
            class="btn btn-outline-primary certificate-card__link"
            type="button"
            data-certificate-modal
            data-certificate-title="${certificate.title}"
            data-certificate-issuer="${certificate.issuer}"
            data-certificate-hours="${certificate.hours}"
            data-certificate-date="${completedAt}"
            data-certificate-image="${certificate.image}"
            data-i18n="buttons.viewCertificate"
        >
            ${labels.viewCertificate}
        </button>
    `;

    return article;
}

function renderCertificates(listElement, items) {
    listElement.innerHTML = "";

    items.forEach(function (certificate) {
        listElement.appendChild(createCertificateCard(certificate));
    });
}

function populateFilters(yearFilter, issuerFilter, topicFilter) {
    const years = getUniqueValues(certificates, function (certificate) {
        return [certificate.year];
    });

    const issuers = getUniqueValues(certificates, function (certificate) {
        return [certificate.issuer];
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
        const matchesIssuer = issuer === "all" || certificate.issuer === issuer;
        const matchesTopic = topic === "all" || certificate.topics.includes(topic);

        return matchesYear && matchesIssuer && matchesTopic;
    });
}

export function setupCertificateArchive() {
    const archive = document.querySelector("[data-certificate-archive]");

    if (!archive) {
        return;
    }

    const listElement = archive.querySelector("[data-certificates-list]");
    const yearFilter = archive.querySelector("[data-filter-year]");
    const issuerFilter = archive.querySelector("[data-filter-issuer]");
    const topicFilter = archive.querySelector("[data-filter-topic]");
    const countElement = archive.querySelector("[data-certificates-count]");
    const emptyElement = archive.querySelector("[data-certificates-empty]");

    if (!listElement || !yearFilter || !issuerFilter || !topicFilter || !countElement || !emptyElement) {
        return;
    }

    function refreshFilterLabels() {
        const selectedYear = yearFilter.value || "all";
        const selectedIssuer = issuerFilter.value || "all";
        const selectedTopic = topicFilter.value || "all";
        const language = getCurrentLanguage();

        yearFilter.innerHTML = "";
        issuerFilter.innerHTML = "";
        topicFilter.innerHTML = "";

        yearFilter.appendChild(createOption(
            "all",
            translations[language]?.["certificatesArchive.allYears"] || "All years"
        ));
        issuerFilter.appendChild(createOption(
            "all",
            translations[language]?.["certificatesArchive.allInstitutions"] || "All institutions"
        ));
        topicFilter.appendChild(createOption(
            "all",
            translations[language]?.["certificatesArchive.allTopics"] || "All areas and tools"
        ));

        populateFilters(yearFilter, issuerFilter, topicFilter);

        yearFilter.value = selectedYear;
        issuerFilter.value = selectedIssuer;
        topicFilter.value = selectedTopic;
    }

    refreshFilterLabels();

    function updateArchive() {
        const filteredCertificates = getFilteredCertificates(
            yearFilter.value,
            issuerFilter.value,
            topicFilter.value
        );

        renderCertificates(listElement, filteredCertificates);

        const count = filteredCertificates.length;
        countElement.textContent = `${count} ${getUiLabels().certificatesFound}`;
        emptyElement.hidden = filteredCertificates.length > 0;
    }

    yearFilter.addEventListener("change", updateArchive);
    issuerFilter.addEventListener("change", updateArchive);
    topicFilter.addEventListener("change", updateArchive);
    document.addEventListener("portfolio:language-change", function () {
        refreshFilterLabels();
        updateArchive();
    });

    updateArchive();
}
