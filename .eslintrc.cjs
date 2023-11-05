module.exports = {
    // Files: [
    //     "**/*.ts",
    //     "**/*.tsx",
    //     "**/*.js",
    //     "**/*.jsx",
    //     "**/*.astro",
    //     "**/*.mjs",
    // ],
    ignorePatterns: [
        "node_modules",
        "dist",
        "build",
        ".cache",
        ".git",
        "**/*.rs",
    ],
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "array-callback-return": "warn",
        "no-await-in-loop": "warn",
        "no-cond-assign": ["warn", "except-parens"],
        "no-constant-binary-expression": "warn",
        "no-duplicate-imports": "warn",
        "no-promise-executor-return": "warn",
        "no-self-compare": "warn",
        "no-template-curly-in-string": "warn",
        "no-unmodified-loop-condition": "warn",
        "no-unreachable-loop": "warn",
        "no-use-before-define": "warn",
        "use-isnan": "warn",
        "require-atomic-updates": "warn",
        camelcase: "warn",
        "class-methods-use-this": "warn",
        complexity: ["warn", 7],
        curly: ["warn", "all"],
        "default-case": "warn",
        "default-case-last": "warn",
        "default-param-last": "warn",
        "dot-notation": "warn",
        eqeqeq: "warn",
        "func-names": "warn",
        "max-depth": ["warn", 4],
        "max-lines": ["warn", 350],
        "max-lines-per-function": ["warn", 50],
        "max-params": ["warn", 4],
        "multiline-comment-style": ["warn", "starred-block"],
        "no-console": "warn",
        "no-else-return": "warn",
        "no-empty": "warn",
        "no-empty-function": "warn",
        "no-floating-decimal": "warn",
        "no-implicit-coercion": "warn",
        "no-implicit-globals": "warn",
    },
    /*
     * LinterOptions: {
     *     reportUnusedDisableDirectives: true,
     * },
     */
};
