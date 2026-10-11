export function setupAccordion(cardSelector, openClass, headerSelector, iconSelector) {
    const cards = document.querySelectorAll(cardSelector);

    cards.forEach(function (card) {
        const button = card.querySelector(headerSelector);
        const icon = card.querySelector(iconSelector);

        if (!button || !icon) {
            return;
        }

        button.setAttribute(
            "aria-expanded",
            card.classList.contains(openClass).toString()
        );

        button.addEventListener("click", function () {
            card.classList.toggle(openClass);

            const isOpen = card.classList.contains(openClass);

            icon.textContent = isOpen ? "-" : "+";
            button.setAttribute("aria-expanded", isOpen.toString());

            button.blur();
        });
    });
}
