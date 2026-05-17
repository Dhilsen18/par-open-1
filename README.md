# Guía base para exámenes Angular (DDD + json-server)

Este repositorio es una **plantilla de práctica** (caso YouTube Music). Úsala como base para construir el examen real (por ejemplo **Eventify**) u otro enunciado: la estructura de capas y patrones se repite; solo cambian **nombres de contextos**, **entidades**, **rutas** y **endpoints**.

---

## 1. Qué hay en este proyecto (caso YouTube)

| Pieza | Ubicación | Qué hace |
|--------|-----------|----------|
| API falsa | `server/db.json` + `npm run server` | json-server en `http://localhost:3000` |
| URL del API | `src/environments/environment.ts` | `apiUrl`, `clearbitLogoUrl` |
| Rutas | `src/app/app.routes.ts` | `/home`, `/support/editors/new`, `**` → 404 |
| Toolbar + 404 + Home shell | `shared/` | UI común y página Home |
| Editores (CRUD + formulario) | `support/` | Entidad principal del formulario (7 pts en práctica) |
| Tracks + Service Orders | `maintenance/` | Datos que alimentan Home y el POST secundario del formulario |

### Endpoints que consume hoy

| Recurso | URL | Contexto |
|---------|-----|----------|
| Tracks | `GET /tracks` | `maintenance` |
| Service orders | `GET/POST /service-orders` | `maintenance` |
| Editors | `GET/POST /editors` (+ filtro `?trackId=`) | `support` |

> El JSON de práctica **no traía** `/editors`; se agregó a mano en `db.json`. En cualquier examen: las claves raíz de `db.json` **son** los endpoints (`"events"` → `/events`).

---

## 2. Arquitectura por capas (igual en todos los casos)

Cada **bounded context** (subdominio) repite esta estructura:

```
contexto/
├── domain/model/          → Entidades y enums (clases TS)
├── application/           → Response, Request, Assembler
├── infrastructure/        → Resource (URLs), Service (HttpClient), Store (Signals, opcional)
└── presentation/
    ├── views/             → Pantallas con ruta (pages)
    └── components/        → Piezas reutilizables (cards, grids)
```

### Flujo de datos (memorizar)

```
Component  →  Service  →  HttpClient  →  json-server
                ↓
           Assembler (JSON → Entity)
                ↓
            Store (opcional, para Home/listas)
```

### Patrones que ya están aplicados

| Patrón | Archivo ejemplo | Rol |
|--------|-----------------|-----|
| **Resource** | `support/infrastructure/support.resource.ts` | Centraliza URLs usando `environment.apiUrl` |
| **Assembler** | `support/application/editor.assembler.ts` | Convierte `EditorResponse` → `Editor` |
| **Request/Response** | `support/application/editor.response.ts` | Tipos del API (POST/GET) |
| **Store** | `support/infrastructure/editor.store.ts` | Estado con Signals (`editors`, `loading`) |
| **Service** | `support/infrastructure/editor.service.ts` | `getAll`, `create`, filtros |

**Regla:** un bounded context = un `XxxResource` con sus endpoints. No mezcles URLs sueltas en componentes.

---

## 3. ¿Cómo saber qué bounded context crear?

**No inventes nombres al azar.** El enunciado del examen los define (o los infieres por **agrupación de negocio**).

### Método en 3 pasos

1. **Lista entidades del `db.json`** (cada clave raíz = un recurso REST).
2. **Agrupa por “quién usa qué” en la UI:**
   - Cosas **transversales** (toolbar, home vacío, 404) → `shared/` (y a veces `public/` si el enunciado lo pide).
   - Cosas del **formulario principal** o acción del usuario → contexto de “acción” (en práctica: `support`; en Eventify: `engagement`).
   - Cosas que **solo se leen** o son “maestro/catálogo” → contexto de “registro/mantenimiento” (en práctica: `maintenance`; en Eventify: `registration`).
3. **Lee el enunciado:** si dice explícitamente `public`, `registration`, `engagement`, usa **esos nombres** aunque tu práctica diga `maintenance` / `support`.

### Comparación: YouTube (esta base) vs Eventify (tu examen)

| Rol en la app | YouTube (este repo) | Eventify (imágenes del examen) |
|---------------|---------------------|--------------------------------|
| UI común, Home, 404 | `shared/` | `shared/` + `public/` |
| Eventos, asistentes | `maintenance/` (tracks, orders) | `registration/` (`events`, `attendees`) |
| Valoraciones / formulario | `support/` (editors) | `engagement/` (`ratings`) |

Los nombres **`maintenance` / `support`** son del caso YouTube. **Eventify pide `registration` / `engagement` / `public`**: renombra carpetas y rutas según el PDF, pero **copia la misma estructura interna** (`domain`, `application`, etc.).

### Mapa mental rápido

```
¿Es toolbar, 404 o layout global?     → shared (o public si lo indican)
¿Es el formulario que más puntos vale? → support / engagement
¿Son catálogos o datos para tarjetas/Home? → maintenance / registration
```

---

## 4. Environments y localhost (backend)

### Archivos

- `src/environments/environment.ts` — desarrollo (`ng serve`)
- `src/environments/environment.prod.ts` — build producción

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',           // ← solo cambias el host si el examen lo indica
  clearbitLogoUrl: 'https://logo.clearbit.com/...'  // ← dominio de la empresa del caso
};
```

### Cómo se usa en el código

Los **Resource** importan `environment` una sola vez:

```typescript
// maintenance/infrastructure/maintenance.resource.ts
static readonly TRACKS = `${environment.apiUrl}/tracks`;
```

**Para otro examen:** cambias `apiUrl` si el puerto/host cambia; en los Resource cambias `/tracks` por `/events`, `/editors` por `/ratings`, etc.

### json-server

```bash
npm run server
# Equivalente a: cd server && json-server --watch db.json --port 3000
```

- Angular: `http://localhost:4200`
- API: `http://localhost:3000`
- CORS: json-server lo permite por defecto en local.

---

## 5. Checklist: qué reemplazar cuando te den otro caso

Usa esta tabla como lista de verificación (Eventify como ejemplo).

| # | Qué | YouTube (actual) | Eventify (ejemplo) |
|---|-----|------------------|---------------------|
| 1 | Nombre proyecto | `ea7401u202319440` | `upc2402si729eau[tucodigo]` |
| 2 | `server/db.json` | `tracks`, `editors`, `service-orders` | `events`, `attendees`, `ratings` |
| 3 | Carpetas `app/` | `shared`, `support`, `maintenance` | `shared`, `public`, `registration`, `engagement` |
| 4 | `environment.clearbitLogoUrl` | `music.youtube.com` | dominio de Eventify |
| 5 | `*.resource.ts` | rutas `/tracks`, `/editors`… | `/events`, `/attendees`, `/ratings` |
| 6 | Entidades `domain/model/` | `Editor`, `Track`… | `Event`, `Attendee`, `Rating` |
| 7 | `app.routes.ts` | `/support/editors/new` | `/engagement/ratings/new` |
| 8 | Toolbar links | Home, New Editor | Home, Rating |
| 9 | `assets/i18n/en.json` y `es.json` | textos YouTube | textos Eventify + mensajes de error exactos del enunciado |
| 10 | Tema Material | el que elijas del listado del examen | uno permitido (ej. `azure-blue`) |
| 11 | Componente “estrella” (más puntos) | `new-editor.component.ts` | vista Rating + validaciones ticket/check-in/duplicado |

**No hace falta reescribir** `app.config.ts`, ngx-translate ni el patrón Store/Assembler si copias carpeta por carpeta y renombras.

---

## 6. Orden de implementación (prioridad de puntos)

Mismo orden que en la guía de práctica; adapta nombres:

1. **Proyecto** — `ng new ... --standalone --routing --style=scss` + Material + `@ngx-translate/core` + `json-server@0.17.4`.
2. **`server/db.json`** — pegar JSON del examen; completar colecciones que falten.
3. **Estructura de carpetas** — según bounded contexts del **PDF** (no los de YouTube si difieren).
4. **Toolbar + Home** (≈5 pts) — logo Clearbit, EN/ES, navegación, contenido Home.
5. **Vista con formulario / lógica fuerte** (≈7 pts) — en YouTube: New Editor; en Eventify: Rating con POST a `/ratings` y validaciones sobre `/attendees`.
6. **Patrones** — Resource, Assembler, Store donde haya listas o estado compartido en Home.
7. **404** — ruta inválida + botón a Home.
8. **i18n** — inglés por defecto; mensajes de error **literales** del enunciado.

---

## 7. Eventify: requisitos clave (desde el enunciado de práctica)

### API

| Endpoint | Campos principales |
|----------|-------------------|
| `GET /events` | `id`, `name`, `description`, `scheduledAt` |
| `GET /attendees` | `id`, `firstName`, `lastName`, `eventId`, `ticketIdentifier`, `checkedInAt` |
| `GET/POST /ratings` | `id`, `attendeeId`, `eventId`, `rating`, `ratedAt` |

### Home

- Título "Home", bienvenida "Welcome to Eventify".
- Sección **Registered Events**: grid con **Event Summary** (2 columnas).
- Cada tarjeta: nombre, descripción; pie: **Checked-In Attendees** (count con `checkedInAt` no null) y **Average Rating** (promedio 1–5, 1 decimal; si no hay → `"No ratings"`).

### Rating — `GET /engagement/ratings/new` (ruta semántica)

Validaciones al enviar:

1. `ticketIdentifier` existe en `/attendees` → si no: `"Invalid Ticket Identifier"`.
2. `checkedInAt` no null → si no: `"You can only rate events you have attended to"`.
3. Un rating por asistente por evento → si ya existe: error de duplicado (texto del enunciado).
4. OK → `POST /ratings` con `attendeeId`, `eventId`, `rating`, `ratedAt` (fecha actual) → `"Event successfully rated"`.

### Rutas

| Ruta | Vista |
|------|--------|
| `/` | redirect → `/home` |
| `/home` | Home |
| `/engagement/ratings/new` | Event Rating |
| `**` | Page not found (mostrar ruta + volver a Home) |

### Equivalencia con tu código YouTube

| YouTube | Eventify | Misma idea |
|---------|----------|------------|
| `NewEditorComponent` | Vista Rating | Formulario + validaciones + POST |
| `editorService.create` + `serviceOrderService.create` | `ratingService.create` | Uno o dos POST según enunciado |
| Validación 1 editor/día/track | ticket + check-in + no duplicar rating | Reglas de negocio en `onSubmit` |
| `EditorAnalyticsComponent` | Grid `EventSummaryComponent` | Home consume varios GET y calcula métricas |
| `SupportResource.EDITORS` | `EngagementResource.RATINGS` | Resource por contexto |

---

## 8. Archivos “ancla” en este repo (copiar mentalmente)

| Archivo | Para qué sirve de plantilla |
|---------|----------------------------|
| `app.config.ts` | Router, HttpClient, Translate |
| `app.component.ts` | Toolbar + `<router-outlet>` |
| `app.routes.ts` | Redirect, children por contexto |
| `environment.ts` | `apiUrl` + logo |
| `shared/.../toolbar.component.ts` | Logo, nav, idiomas |
| `shared/.../page-not-found.component.ts` | 404 con `router.url` |
| `support/.../new-editor.component.ts` | Formulario reactivo, snackbar, navigate home |
| `support/.../editor.service.ts` | HttpClient + Assembler + Resource |
| `support/.../editor.assembler.ts` | Mapeo response → entity |
| `maintenance/.../maintenance.resource.ts` | Patrón de URLs |

---

## 9. Comandos

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — Angular
npm install
npm start
```

---

## 10. Detalles técnicos del examen (recordatorio)

- Angular **18+**, componentes **standalone**.
- **Angular Material** + un tema predefinido del listado.
- **@ngx-translate/core** — idioma por defecto **inglés**.
- **HttpClient** para el backend.
- **DatePipe** en plantillas para fechas.
- Atributos **ARIA** en vistas.
- Código y nombres de objetos en **inglés**; JSDoc con `@summary` y `@author`.
- Este README + descripción de la app según pida el entregable.

---

## 11. Autor (plantilla)

**Código:** U202319440  
**Curso:** Desarrollo de Aplicaciones Open Source (1ASI0729)  
**NRC:** 7401  
**Institución:** UPC  

> Sustituye nombre, código y descripción cuando entregues el examen oficial (Eventify).

---

## Resumen en una frase

**Los bounded contexts vienen del enunciado; las capas y patrones son siempre los mismos; `environment.apiUrl` centraliza localhost; `db.json` define los endpoints; solo sustituyes entidades, rutas, textos i18n y el componente de formulario que concentra la lógica de negocio.**
