module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "react-app"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "indent": ["error", 2],
        "no-unused-vars": "warn",
        "eqeqeq": ["error", "always"],
        "no-console": "warn",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
        "react/jsx-uses-vars": "error"
    },
    env: {
        browser: true,
        node: true,
        es6: true
    }
};