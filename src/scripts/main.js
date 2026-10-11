import { setupAccordion } from "./modules/accordion.js";
import { setupClickBlur } from "./modules/click-blur.js";
import { setupLanguageToggle } from "./modules/language.js";
import { setupCertificateArchive } from "./modules/certificate-archive.js";
import { setupCertificateModal } from "./modules/certificate-modal.js";
import { setupProjectArchive } from "./modules/project-archive.js";

async function init() {
    setupLanguageToggle();
    setupCertificateArchive();
    setupCertificateModal();

    await setupProjectArchive();

    setupAccordion(
        ".system-card",
        "system-card--open",
        ".system-card__header",
        ".system-card__icon"
    );

    setupClickBlur();
}

init();
