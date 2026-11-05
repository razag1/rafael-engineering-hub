import { setupAccordion } from "./modules/accordion.js";
import { setupClickBlur } from "./modules/click-blur.js";
import { setupLanguageToggle } from "./modules/language.js";
import { setupCertificateArchive } from "./modules/certificate-archive.js";
import { setupCertificateModal } from "./modules/certificate-modal.js";
import { setupProjectArchive } from "./modules/project-archive.js";

export function init() {
    setupLanguageToggle();
    setupCertificateArchive();
    setupCertificateModal();

    // Local projects render synchronously; the GitHub enrichment continues in
    // the background and must not delay unrelated interactions.
    void setupProjectArchive();

    setupAccordion(
        ".system-card",
        "system-card--open",
        ".system-card__header",
        ".system-card__icon",
    );

    setupClickBlur();
}

init();
