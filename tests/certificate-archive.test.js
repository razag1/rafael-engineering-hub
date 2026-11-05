import { describe, expect, it } from "vitest";
import { setupCertificateArchive } from "../src/scripts/modules/certificate-archive.js";

function renderArchiveFixture() {
    document.body.innerHTML = `
        <section data-certificate-archive>
            <select data-filter-year></select>
            <select data-filter-issuer></select>
            <select data-filter-topic></select>
            <p data-certificates-count></p>
            <p data-certificates-empty hidden></p>
            <div data-certificates-list></div>
        </section>
    `;
}

describe("certificate archive", function () {
    it("groups joint certificates under Alura without changing the issuer details", function () {
        renderArchiveFixture();
        setupCertificateArchive();

        const list = document.querySelector("[data-certificates-list]");
        const issuerFilter = document.querySelector("[data-filter-issuer]");

        expect(list.children).toHaveLength(20);
        expect(list.querySelectorAll("script")).toHaveLength(0);

        const issuerOptions = [...issuerFilter.options].map((option) => option.value);
        expect(issuerOptions).toContain("Alura");
        expect(issuerOptions).not.toContain("Alura + Google for Startups");

        issuerFilter.value = "Alura";
        issuerFilter.dispatchEvent(new Event("change"));

        expect(list.children).toHaveLength(6);
        expect(document.querySelector("[data-certificates-count]").textContent).toContain("6");

        const jointCertificate = list.querySelector('[data-issuer="Alura + Google for Startups"]');
        expect(jointCertificate).not.toBeNull();
        expect(jointCertificate.dataset.issuerGroup).toBe("Alura");
        expect(jointCertificate.querySelector(".certificate-card__issuer").textContent).toBe(
            "Alura + Google for Startups",
        );

        localStorage.setItem("portfolioLanguage", "pt");
        document.dispatchEvent(new CustomEvent("portfolio:language-change"));

        expect(issuerFilter.value).toBe("Alura");
        expect(list.children).toHaveLength(6);
        expect(issuerFilter.options[0].textContent).toBe("Todas as instituições");
    });

    it("renders three localized featured certificates from the shared catalog", function () {
        document.body.innerHTML = "<div data-featured-certificates></div>";
        setupCertificateArchive();

        const featuredList = document.querySelector("[data-featured-certificates]");
        const cards = featuredList.querySelectorAll(".certificate-card");
        const aiCard = cards[2];

        expect(cards).toHaveLength(3);
        expect(aiCard.querySelector(".certificate-card__issuer").textContent).toBe(
            "Alura + Google for Startups",
        );
        expect(aiCard.querySelector(".certificate-card__title").textContent).toBe(
            "Software Engineering Immersion: Development in the AI Era",
        );
        expect(aiCard.querySelector("[data-certificate-modal]").dataset.certificateIssuer).toBe(
            "Alura + Google for Startups",
        );

        localStorage.setItem("portfolioLanguage", "pt");
        document.dispatchEvent(new CustomEvent("portfolio:language-change"));

        expect(
            featuredList
                .querySelectorAll(".certificate-card")[2]
                .querySelector(".certificate-card__title").textContent,
        ).toBe("Imersão Engenharia de Software: Dev na Era da IA");
    });
});
