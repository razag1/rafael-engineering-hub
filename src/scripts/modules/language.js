import { translations } from "../data/translations.js";

function applyLanguage(language) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(function (element) {
        const key = element.getAttribute("data-i18n");

        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    const languageButton = document.querySelector("#language-toggle");

    if (languageButton) {
        languageButton.textContent = language === "pt"
            ? "language.ini: PT-BR"
            : "language.ini: EN";

        languageButton.setAttribute(
            "aria-label",
            language === "pt" ? "Alterar idioma" : "Change language"
        );
    }

    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    localStorage.setItem("portfolioLanguage", language);
    document.dispatchEvent(new CustomEvent("portfolio:language-change", {
        detail: { language }
    }));
}

export function setupLanguageToggle() {
    const languageButton = document.querySelector("#language-toggle");

    if (!languageButton) {
        return;
    }

    const savedLanguage = localStorage.getItem("portfolioLanguage") || "en";

    applyLanguage(savedLanguage);

    languageButton.addEventListener("click", function () {
        const currentLanguage = localStorage.getItem("portfolioLanguage") || "en";
        const nextLanguage = currentLanguage === "en" ? "pt" : "en";

        applyLanguage(nextLanguage);
        languageButton.blur();
    });
}
