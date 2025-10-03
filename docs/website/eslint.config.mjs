export default [
    {
        ignores: ["dist/**", "node_modules/**"]
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                fetch: "readonly",
                IntersectionObserver: "readonly",
                MutationObserver: "readonly"
            }
        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": "warn"
        }
    }
];