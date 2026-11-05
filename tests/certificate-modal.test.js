import { describe, expect, it } from "vitest";
import { setupCertificateModal } from "../src/scripts/modules/certificate-modal.js";

function renderModalFixture() {
    document.body.innerHTML = `
        <button
            id="trigger"
            data-certificate-modal
            data-certificate-title="Test certificate"
            data-certificate-issuer="Issuer"
            data-certificate-hours="10h"
            data-certificate-date="2026"
            data-certificate-image="certificate.webp"
        >Open</button>
        <div class="certificate-modal" id="certificate-modal" aria-hidden="true">
            <div data-certificate-close></div>
            <section role="dialog" tabindex="-1">
                <button id="close" data-certificate-close>Close</button>
                <img id="certificate-modal-image" alt="">
                <p id="certificate-modal-issuer"></p>
                <h3 id="certificate-modal-name"></h3>
                <p id="certificate-modal-hours"></p>
                <p id="certificate-modal-date"></p>
                <div data-certificate-viewport></div>
                <button data-certificate-zoom-out>Out</button>
                <button data-certificate-zoom-reset>100%</button>
                <button id="last" data-certificate-zoom-in>In</button>
            </section>
        </div>
    `;
}

describe("certificate modal", function () {
    it("traps keyboard focus, closes with Escape and restores the trigger", function () {
        renderModalFixture();
        setupCertificateModal();

        const trigger = document.querySelector("#trigger");
        const modal = document.querySelector("#certificate-modal");
        const closeButton = document.querySelector("#close");
        const lastButton = document.querySelector("#last");

        trigger.focus();
        trigger.click();

        expect(modal.getAttribute("aria-hidden")).toBe("false");
        expect(document.activeElement).toBe(closeButton);

        lastButton.focus();
        lastButton.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
        expect(document.activeElement).toBe(closeButton);

        closeButton.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }),
        );
        expect(document.activeElement).toBe(lastButton);

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(modal.getAttribute("aria-hidden")).toBe("true");
        expect(document.activeElement).toBe(trigger);
    });
});
