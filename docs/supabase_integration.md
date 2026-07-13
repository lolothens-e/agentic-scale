# Documentación de Integración: Supabase (PostgreSQL)

Esta documentación explica cómo está estructurada la capa de base de datos relacional del proyecto utilizando Supabase y PostgreSQL, y cómo el frontend interactúa con ella.

## 1. Arquitectura de la Base de Datos

El proyecto utiliza un esquema relacional estricto. Las tablas principales son:

- **`assets`**: Catálogo central de instrumentos financieros (ej. `NVDA`, `BTC`).
- **`news`**: Registro centralizado de noticias procesadas.
- **`news_analysis`**: Análisis generado por IA (Gemini) para cada noticia.
- **`watchlists`** y **`watchlist_assets`**: Listas de seguimiento personalizadas por el usuario.
- **`briefings`**: Reportes de analistas generados a partir de noticias, vinculados a un activo y a una watchlist.

> **Restricciones de Llaves Foráneas (Foreign Keys):**  
> Para poder insertar un análisis (`news_analysis`) o un reporte (`briefings`), **es obligatorio** que el activo exista primero en la tabla `assets` y la noticia exista en la tabla `news`. Nuestro servicio se encarga de hacer esto automáticamente.

## 2. Configuración Local

Para que la aplicación funcione en tu entorno local, necesitas conectarla a Supabase:

1. Asegúrate de tener instalado el cliente ejecutando `npm install`.
2. Crea o edita el archivo `.env` en la raíz del proyecto.
3. Agrega las credenciales (solicítalas al administrador del proyecto):
```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 3. Servicios del Frontend

Toda la comunicación con la base de datos se realiza a través de dos archivos ubicados en `src/services/`:

### `supabaseClient.js`
Es el punto de entrada. Inicializa la conexión utilizando las variables de entorno y exporta la instancia `supabase` para que el resto de la aplicación pueda hacer consultas.

### `supabaseService.js`
Es la capa de abstracción CRUD (Create, Read, Update, Delete). El resto de la aplicación (como `DashboardContext.jsx`) nunca llama a Supabase directamente, sino que usa las funciones de este archivo.

#### Funciones Principales:
- `loadBriefings()`: Carga todos los reportes ordenados por fecha de creación (más recientes primero).
- `saveBriefing(briefing, newsItemContext)`: Guarda un reporte. **Ojo:** Requiere el objeto de la noticia original para asegurarse de insertarlo en la BD antes de vincular el reporte.
- `updateBriefingField(id, field, value)`: Actualiza campos específicos de un reporte (ej. cambiar el estado a "Escalada"). Respeta los `ENUM` definidos en SQL.
- `getCachedAnalysis(headline)`: Verifica si una noticia ya fue analizada por la IA previamente, buscando en la base de datos para ahorrar costos de API.
- `saveCachedAnalysis(newsItemContext, analysis)`: Guarda el resultado del análisis de Gemini.
- `loadWatchlists()`, `saveWatchlist(watchlist)`, `deleteWatchlistDoc(name)`: Gestionan el CRUD completo de las listas de seguimiento, asegurándose de insertar los activos en la tabla `assets` de ser necesario.

## 4. Flujo de Datos (Ejemplo: Crear un Briefing)

Cuando el usuario hace clic en "Generar Briefing" en la interfaz:
1. `DashboardContext` intercepta la acción y genera un objeto temporal.
2. Llama a `saveBriefing(nuevoBriefing, noticiaOriginal)`.
3. `supabaseService` primero hace un *upsert* en la tabla `assets` para garantizar que el símbolo existe.
4. Hace un *upsert* en la tabla `news` para guardar la noticia base y recupera su `UUID` real.
5. Finalmente, hace un *insert* en la tabla `briefings` utilizando el `UUID` de la noticia obtenida en el paso anterior.

## 5. Visualización de Datos
Para administrar directamente la base de datos:
1. Entra a tu [Dashboard de Supabase](https://supabase.com/dashboard).
2. Ve a la sección **Table Editor** (icono de cuadrícula en el menú izquierdo).
3. Selecciona el esquema `public`.
4. Selecciona cualquier tabla para ver, editar o eliminar registros en tiempo real.
