import { describe, expect, it, vi } from "vitest";
import { getProjectsWithGitHubData } from "../src/scripts/modules/project-archive.js";

describe("project archive integration", function () {
    it("falls back to the curated local catalog when GitHub is unavailable", async function () {
        const fetchImplementation = vi.fn().mockRejectedValue(new Error("offline"));

        const projects = await getProjectsWithGitHubData(fetchImplementation);

        expect(projects).toHaveLength(3);
        expect(projects.map((project) => project.id)).toEqual([
            "aurora-cafe",
            "cipherpy",
            "projeto-6",
        ]);
    });

    it("rejects unsafe repository URLs returned by the API", async function () {
        const fetchImplementation = vi.fn().mockResolvedValue({
            ok: true,
            json: async function () {
                return [
                    {
                        name: "Aurora_Cafe",
                        html_url: "javascript:alert(1)",
                        language: "HTML",
                        topics: [],
                    },
                ];
            },
        });

        const projects = await getProjectsWithGitHubData(fetchImplementation);

        expect(projects[0].repositoryUrl).toBe("https://github.com/razag1/Aurora_Cafe");
    });
});
