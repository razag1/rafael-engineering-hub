export function setupCertificateModal() {
    const modal = document.querySelector("#certificate-modal");
    const modalImage = document.querySelector("#certificate-modal-image");
    const modalIssuer = document.querySelector("#certificate-modal-issuer");
    const modalName = document.querySelector("#certificate-modal-name");
    const modalHours = document.querySelector("#certificate-modal-hours");
    const modalDate = document.querySelector("#certificate-modal-date");
    const closeButtons = document.querySelectorAll("[data-certificate-close]");
    const zoomOutButton = modal?.querySelector("[data-certificate-zoom-out]");
    const zoomResetButton = modal?.querySelector("[data-certificate-zoom-reset]");
    const zoomInButton = modal?.querySelector("[data-certificate-zoom-in]");
    const viewport = modal?.querySelector("[data-certificate-viewport]");
    const dialog = modal?.querySelector('[role="dialog"]');
    const focusableSelector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const minZoom = 1;
    const maxZoom = 2.5;
    const zoomStep = 0.25;
    let zoom = 1;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScrollLeft = 0;
    let dragStartScrollTop = 0;
    let triggerElement = null;

    if (!modal || !modalImage || !modalIssuer || !modalName || !modalHours || !modalDate) {
        return;
    }

    function updateZoom() {
        modalImage.style.transform = `scale(${zoom})`;
        modalImage.style.transformOrigin = "top left";

        if (zoomResetButton) {
            zoomResetButton.textContent = `${Math.round(zoom * 100)}%`;
        }
    }

    function resetZoom() {
        zoom = 1;
        updateZoom();

        if (viewport) {
            viewport.scrollLeft = 0;
            viewport.scrollTop = 0;
        }
    }

    function stopDragging() {
        isDragging = false;
        viewport?.classList.remove("certificate-modal__viewport--dragging");
    }

    function openModal(button) {
        const certificateCard = button.closest(".certificate-card");
        const translatedTitle = certificateCard
            ? certificateCard.querySelector(".certificate-card__title")?.textContent.trim()
            : "";

        const title = translatedTitle || button.getAttribute("data-certificate-title") || "";
        const issuer = button.getAttribute("data-certificate-issuer") || "";
        const hours = button.getAttribute("data-certificate-hours") || "";
        const date = button.getAttribute("data-certificate-date") || "";
        const image = button.getAttribute("data-certificate-image") || "";

        modalName.textContent = title;
        modalIssuer.textContent = issuer;
        modalHours.textContent = hours;
        modalDate.textContent = date;

        modalImage.src = image;
        modalImage.alt = `Certificate - ${title}`;
        resetZoom();

        modal.classList.add("certificate-modal--open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");
        triggerElement = button;

        const firstFocusableElement = dialog?.querySelector(focusableSelector);
        (firstFocusableElement || dialog)?.focus();
    }

    function closeModal() {
        if (!modal.classList.contains("certificate-modal--open")) {
            return;
        }

        stopDragging();
        modal.classList.remove("certificate-modal--open");
        modal.setAttribute("aria-hidden", "true");

        modalImage.src = "";
        modalImage.alt = "";

        document.body.classList.remove("modal-open");

        if (triggerElement?.isConnected) {
            triggerElement.focus();
        }

        triggerElement = null;
    }

    function trapFocus(event) {
        if (event.key !== "Tab" || !dialog) {
            return;
        }

        const focusableElements = [...dialog.querySelectorAll(focusableSelector)].filter(
            function (element) {
                return (
                    !element.hasAttribute("hidden") &&
                    element.getAttribute("aria-hidden") !== "true"
                );
            },
        );

        if (focusableElements.length === 0) {
            event.preventDefault();
            dialog.focus();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-certificate-modal]");

        if (!button) {
            return;
        }

        openModal(button);
    });

    closeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal();
            button.blur();
        });
    });

    if (zoomOutButton) {
        zoomOutButton.addEventListener("click", function () {
            zoom = Math.max(minZoom, zoom - zoomStep);
            updateZoom();
            zoomOutButton.blur();
        });
    }

    if (zoomResetButton) {
        zoomResetButton.addEventListener("click", function () {
            resetZoom();
            zoomResetButton.blur();
        });
    }

    if (zoomInButton) {
        zoomInButton.addEventListener("click", function () {
            zoom = Math.min(maxZoom, zoom + zoomStep);
            updateZoom();
            zoomInButton.blur();
        });
    }

    if (viewport) {
        viewport.addEventListener("mousedown", function (event) {
            if (event.button !== 0) return;

            isDragging = true;
            dragStartX = event.clientX;
            dragStartY = event.clientY;
            dragStartScrollLeft = viewport.scrollLeft;
            dragStartScrollTop = viewport.scrollTop;
            viewport.classList.add("certificate-modal__viewport--dragging");
            event.preventDefault();
        });

        viewport.addEventListener("mousemove", function (event) {
            if (!isDragging) return;

            viewport.scrollLeft = dragStartScrollLeft - (event.clientX - dragStartX);
            viewport.scrollTop = dragStartScrollTop - (event.clientY - dragStartY);
            event.preventDefault();
        });

        viewport.addEventListener("mouseup", stopDragging);
        viewport.addEventListener("mouseleave", stopDragging);
        document.addEventListener("mouseup", stopDragging);
    }

    document.addEventListener("keydown", function (event) {
        if (!modal.classList.contains("certificate-modal--open")) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }

        trapFocus(event);
    });
}
