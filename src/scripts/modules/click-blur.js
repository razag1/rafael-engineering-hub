export function setupClickBlur() {
    const clickableElements = document.querySelectorAll(
        ".btn, .window__button, .hub-toolbar__button"
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
