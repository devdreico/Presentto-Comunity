# Presentto-Comunity

Comunidad abierta de Presentto para compartir ideas, comunicados y recursos para emprendedores. El Feed es editorial: las publicaciones se agregan en código, no desde cuentas de usuarios.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

## Contenido

- `src/data.js`: publicaciones oficiales y directorio de herramientas. Cada herramienta incluye su categoría, descripción, pasos de inicio y enlace.
- `src/App.jsx`: navegación, feed, filtros, búsqueda y guardados locales.
- `src/EcosystemScene.jsx`: visualización 3D interactiva del ecosistema con React Three Fiber.
- `src/styles.css`: estilos, utilidades de Tailwind y adaptación responsive.

Las publicaciones no tienen un formulario ni una API de envío; para actualizar el Feed, edita el arreglo `posts` en `src/data.js`.