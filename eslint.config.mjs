import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...nextCoreWebVitals],

    settings: {
        next: {
            rootDir: "./",
        },
    },
}, {
    // New in eslint-config-next 16 (React Compiler rules); the pre-upgrade config did not enforce them.
    // Kept visible as warnings; fix them in components as they are touched.
    rules: {
        "react-hooks/set-state-in-effect": "warn",
        "react-hooks/error-boundaries": "warn",
        "react-hooks/purity": "warn",
        "react-hooks/static-components": "warn",
    },
}, {
    ignores: ["public/sw.js", "public/workbox-*.js", ".next/**", "scripts/**"],
}]);