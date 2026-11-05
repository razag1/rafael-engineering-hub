import { afterEach } from "vitest";

afterEach(function () {
    document.body.replaceChildren();
    document.documentElement.lang = "en";
    localStorage.clear();
});
