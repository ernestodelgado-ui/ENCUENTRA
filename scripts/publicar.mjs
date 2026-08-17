/**
 * Publica el sitio compilado en la raíz del repositorio.
 *
 * POR QUÉ EXISTE ESTO
 *
 * GitHub Pages está configurado como "Deploy from a branch" (main / raíz). En
 * ese modo GitHub corre su propio workflow de Jekyll en cada push, que compite
 * con el nuestro y a veces le gana: cuando eso pasa, el sitio publicado queda
 * siendo un render del README en lugar de la aplicación.
 *
 * Mientras esa configuración siga así, la forma segura de publicar es dejar el
 * sitio ya compilado en la raíz junto con un `.nojekyll`, que le dice a GitHub
 * que sirva los archivos tal cual, sin procesarlos. Así, gane el workflow que
 * gane, lo que se sirve es la aplicación.
 *
 * CÓMO SACAR ESTE PARCHE
 *
 * En Settings > Pages > Source, elegir "GitHub Actions". Eso desactiva el
 * workflow de Jekyll y deja de haber competencia. Después alcanza con borrar
 * los archivos publicados de la raíz (`node scripts/publicar.mjs --limpiar`),
 * este script y el .nojekyll.
 */

import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const SALIDA = join(RAIZ, "out");
const MANIFIESTO = join(RAIZ, ".publicado.json");
const BASE_PATH = "/ENCUENTRA";

/**
 * Nada de esta lista se borra nunca, pase lo que pase con el manifiesto. Es la
 * red de seguridad: este script mueve archivos en la raíz del repositorio y un
 * error acá se llevaría puesto el código.
 */
const INTOCABLES = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".env.example",
  ".env.local",
  ".nojekyll",
  ".publicado.json",
  "app",
  "components",
  "lib",
  "public",
  "design",
  "scripts",
  "node_modules",
  "out",
  ".next",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "next-env.d.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
]);

function leerManifiesto() {
  if (!existsSync(MANIFIESTO)) return [];
  try {
    const datos = JSON.parse(readFileSync(MANIFIESTO, "utf8"));
    return Array.isArray(datos.entradas) ? datos.entradas : [];
  } catch {
    return [];
  }
}

function limpiarPublicado() {
  let borradas = 0;

  for (const entrada of leerManifiesto()) {
    if (INTOCABLES.has(entrada)) {
      console.warn(`  omitida por seguridad: ${entrada}`);
      continue;
    }
    const destino = join(RAIZ, entrada);
    if (existsSync(destino)) {
      rmSync(destino, { recursive: true, force: true });
      borradas++;
    }
  }

  if (existsSync(MANIFIESTO)) rmSync(MANIFIESTO);
  console.log(`  ${borradas} entradas borradas de la raíz`);
}

if (process.argv.includes("--limpiar")) {
  console.log("Quitando el sitio publicado de la raíz...");
  limpiarPublicado();
  if (existsSync(join(RAIZ, ".nojekyll"))) rmSync(join(RAIZ, ".nojekyll"));
  console.log("Listo.");
  process.exit(0);
}

console.log(`Compilando con basePath ${BASE_PATH}...`);
execFileSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: BASE_PATH },
});

if (!existsSync(SALIDA)) {
  console.error("No se generó out/. Se aborta sin tocar la raíz.");
  process.exit(1);
}

console.log("Quitando la publicación anterior...");
limpiarPublicado();

console.log("Copiando el sitio a la raíz...");
const entradas = readdirSync(SALIDA);

for (const entrada of entradas) {
  if (INTOCABLES.has(entrada)) {
    console.error(`  ¡conflicto! "${entrada}" choca con el código fuente.`);
    process.exit(1);
  }
  cpSync(join(SALIDA, entrada), join(RAIZ, entrada), { recursive: true });
}

// Sin esto GitHub procesa el sitio con Jekyll y descarta todo lo que empieza
// con guión bajo, incluida la carpeta _next.
writeFileSync(join(RAIZ, ".nojekyll"), "");

writeFileSync(
  MANIFIESTO,
  `${JSON.stringify(
    {
      _comentario:
        "Generado por scripts/publicar.mjs. Lista lo que el script puede borrar de la raíz en la próxima publicación. No editar a mano.",
      publicadoEn: new Date().toISOString(),
      entradas,
    },
    null,
    2
  )}\n`
);

mkdirSync(join(RAIZ, "out"), { recursive: true });
console.log(`Listo: ${entradas.length} entradas publicadas en la raíz.`);
