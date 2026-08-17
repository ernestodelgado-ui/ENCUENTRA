# encuentra.

Buscador de propiedades en Uruguay. La persona define qué busca con filtros,
ve propiedades disponibles que coinciden y, si quiere, arranca una conversación
por WhatsApp con un asesor.

**En vivo:** https://ernestodelgado-ui.github.io/ENCUENTRA/

## Cómo correrlo

```bash
npm install
npm run dev
```

Queda en http://localhost:3000.

Para que los botones de WhatsApp apunten al número correcto, copiá
`.env.example` como `.env.local` y completá el número.

## Cómo se publica

Cada push a `main` dispara el workflow de `.github/workflows/deploy.yml`, que
compila el sitio estático y lo sube a GitHub Pages. No hay que hacer nada a
mano.

Para que funcione, una sola vez en el repositorio:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables →** crear
   `NEXT_PUBLIC_WHATSAPP_NUMERO` con el número del asesor en formato
   internacional sin `+` ni espacios (ej. `59899123456`).

## Cargar y mantener propiedades

Las propiedades viven en [`lib/propiedades/data.ts`](lib/propiedades/data.ts),
con las instrucciones al principio del archivo.

En resumen:

| Qué querés hacer | Cómo |
|---|---|
| Agregar una | Copiar un bloque y cambiarle `id` y `reference` |
| Cambiar el precio | `price` y actualizar `updated_at` |
| Darla de baja (vendida, alquilada) | `active: false` — deja de aparecer y su ficha da 404 |
| Confirmar que sigue disponible | Actualizar `last_verified_at` |
| Sumar fotos | Archivos en `public/propiedades/` y referenciarlos en `images` |
| Enlazar la publicación original | `external_url` |

Si pasan más de 30 días sin actualizar `last_verified_at`, la ficha avisa que
hay que reconfirmar disponibilidad. No la oculta.

> Las propiedades que hay hoy son **de ejemplo**, para poder ver la pantalla de
> resultados. Hay que reemplazarlas por las reales.

## Cómo está armado

- **Next.js 16** (App Router) exportado como sitio estático.
- **Tailwind v4**, con los colores y tipografías en `app/globals.css`.
- Los criterios de búsqueda viajan en la **query string** (`/resultados?op=…`),
  así una búsqueda se puede compartir y el botón atrás funciona solo.
- El **motor de búsqueda** (`lib/propiedades/matching.ts`) trabaja en tres
  niveles: filtros duros (operación, tipo, zona) que nunca se relajan, filtros
  ajustables (precio, dormitorios, baños) que definen la coincidencia exacta, y
  características que sólo ordenan por relevancia. De ahí sale la sección
  "quizás también te interesen" sin necesitar una segunda búsqueda.
- **No se piden datos personales** en ningún momento. El contacto ocurre dentro
  de WhatsApp, con el mensaje ya escrito y enviado por decisión de la persona.

### Preparado para sumar IA

Todavía no hay IA y el sitio no la menciona. Cuando se agregue la búsqueda por
texto libre, va a interpretar la frase y producir **los mismos parámetros de
URL** que arma el formulario hoy, alimentando el mismo motor. Ni las pantallas
ni el matching cambian.

## Analítica

Los eventos pasan todos por `lib/analytics.ts`. Hoy **no hay ningún proveedor
instalado**: se ven en la consola del navegador durante el desarrollo y no se
envían a ninguna parte. Para enchufar Plausible, Vercel Analytics u otro, se
cambia únicamente la función `enviar`.

No se guardan nombre, teléfono ni email, y no se usan cookies.
