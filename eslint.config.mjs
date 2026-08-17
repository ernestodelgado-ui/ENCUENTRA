import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sitio compilado que scripts/publicar.mjs deja en la raíz para que GitHub
    // Pages lo sirva. Es código generado y minificado: no se revisa.
    "_next/**",
  ]),
]);

export default eslintConfig;
