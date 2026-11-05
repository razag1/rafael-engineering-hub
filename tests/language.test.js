import { describe, expect, it } from "vitest";
import { setupLanguageToggle } from "../src/scripts/modules/language.js";

describe("language toggle", function () {
    it("applies, persists and announces the selected language", function () {
        document.body.innerHTML = `
            <button id="language-toggle"></button>
            <p data-i18n="buttons.backToHome"></p>
            <button data-i18n-aria-label="accessibility.closeCertificateModal"></button>
        `;

        setupLanguageToggle();

        const toggle = document.querySelector("#language-toggle");
        const label = document.querySelector("[data-i18n]");
        const closeButton = document.querySelector("[data-i18n-aria-label]");

        expect(label.textContent).toBe("Back to Home");
        toggle.click();

        expect(document.documentElement.lang).toBe("pt-BR");
        expect(localStorage.getItem("portfolioLanguage")).toBe("pt");
        expect(label.textContent).toBe("Voltar para Home");
        expect(closeButton.getAttribute("aria-label")).toBe("Fechar visualizador de certificado");
    });
});
