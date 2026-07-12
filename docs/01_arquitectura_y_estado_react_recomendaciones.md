# Arquitectura Frontend y Gestión de Estado (React + Vite)

## 1. Definición del Stack
El proyecto operará exclusivamente en el cliente para acelerar el desarrollo en las 48 horas.
* **Core:** React 18 + Vite (ofrece HMR rápido y empaquetado optimizado).
* **Estilos:** CSS puro con variables para el Dark Mode premium (`#0a0f1d`, `#121a2e`) y CSS Grid para la estructura de 3 columnas.
* **Seguridad:** Archivo `.env.local` obligatorio para almacenar `VITE_FINNHUB_API_KEY` y `VITE_GEMINI_API_KEY`.

## 2. Capa de Servicios (Service Layer)
Para mantener los componentes limpios, las peticiones HTTP se abstraen en la carpeta `src/services/`.
* `finnhubService.js`: Funciones `fetch` dedicadas a consumir noticias y formatear el JSON crudo en un array estandarizado para la aplicación.
* `llmService.js`: Maneja el prompt estructurado que se envía al modelo de IA, asegurando que la respuesta retorne en un formato JSON predecible (Impacto, Confianza, Justificación).

## 3. Gestión de Estado y Persistencia
Se descarta el uso excesivo de `useState` básicos a favor de un manejador centralizado.
* **Hook de Estado Global:** Uso de `useReducer` (o Zustand) para manejar acciones complejas como `SET_NEWS`, `FILTER_NEWS`, `UPDATE_BRIEFING_STATUS`.
* [cite_start]**Persistencia (LocalStorage):** Creación del hook `useLocalStorageBriefings` para guardar las justificaciones y estados de revisión del analista directamente en el navegador, asegurando que los datos no se pierdan al recargar la página durante la demostración de la HU3[cite: 42].