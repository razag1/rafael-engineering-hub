import js from "@eslint/js";

const browserGlobals = {
    AbortController: "readonly",
    CustomEvent: "readonly",
    URL: "readonly",
    clearTimeout: "readonly",
    document: "readonly",
    fetch: "readonly",
    localStorage: "readonly",
    setTimeout: "readonly",
    window: "readonly",
};

export default [
    {
        ignores: ["dist/**", ".parcel-cache/**", "node_modules/**"],
    },
    js.configs.recommended,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: browserGlobals,
        },
    },
    {
        files: ["tools/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                __dirname: "readonly",
                console: "readonly",
                require: "readonly",
            },
        },
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...browserGlobals,
                Event: "readonly",
                KeyboardEvent: "readonly",
            },
        },
    },
];
