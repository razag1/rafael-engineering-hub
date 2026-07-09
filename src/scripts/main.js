function setupAccordion(cardSelector, openClass, headerSelector, iconSelector) {
    const cards = document.querySelectorAll(cardSelector);

    cards.forEach(function (card) {
        const button = card.querySelector(headerSelector);
        const icon = card.querySelector(iconSelector);

        if (!button || !icon) {
            return;
        }

        button.addEventListener("click", function () {
            card.classList.toggle(openClass);

            if (card.classList.contains(openClass)) {
                icon.textContent = "-";
            } else {
                icon.textContent = "+";
            }

            button.blur();
        });
    });
}

function setupClickBlur() {
    const clickableElements = document.querySelectorAll(
        ".btn, .window__button"
    );

    clickableElements.forEach(function (element) {
        element.addEventListener("mouseup", function () {
            element.blur();
        });

        element.addEventListener("touchend", function () {
            element.blur();
        });
    });
}

setupAccordion(
    ".project-card",
    "project-card--open",
    ".project-card__header",
    ".project-card__icon"
);

setupAccordion(
    ".system-card",
    "system-card--open",
    ".system-card__header",
    ".system-card__icon"
);

setupClickBlur();