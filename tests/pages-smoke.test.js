import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pages = ["index.html", "projetos.html", "certificados.html"];

describe.each(pages)("%s smoke test", function (page) {
    it("has a titled main landmark and valid local static references", function () {
        const pagePath = path.resolve("src", page);
        const html = fs.readFileSync(pagePath, "utf8");
        const parser = new window.DOMParser();
        const document = parser.parseFromString(html, "text/html");

        expect(document.title).not.toBe("");
        expect(document.querySelector("main#main-content")).not.toBeNull();
        expect(document.querySelector("h1")).not.toBeNull();
        expect(document.querySelector('a[href="#main-content"]')).not.toBeNull();

        const localReferences = [...document.querySelectorAll("link[href], script[src], img[src]")]
            .map((element) => element.getAttribute("href") || element.getAttribute("src"))
            .filter((reference) => reference?.startsWith("./"));

        localReferences.forEach(function (reference) {
            expect(fs.existsSync(path.resolve("src", reference))).toBe(true);
        });
    });
});
