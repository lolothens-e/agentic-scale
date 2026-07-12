# Implementación HU2: Señal Explicable de Impacto

## 1. Objetivo y Criterios
[cite_start]Clasificar el impacto de la noticia, comparar con datos de precio, explicar con evidencia y mostrar el disclaimer[cite: 38, 39, 41].

## 2. Componentes UI (React)
* **`ImpactDetail.jsx` (Columna 2):** Vista dinámica que reacciona a la noticia seleccionada en el radar.
* **`ImpactBadge.jsx`:** Componente visual que cambia de color según la dirección: Positivo (`#10b981`), Negativo (`#ef4444`), Neutral/Incierto (`#f59e0b`). [cite_start]Muestra el nivel de confianza numérico (%)[cite: 38].
* [cite_start]**`PriceComparison.jsx`:** Renderiza la comparación histórica[cite: 39]. Puede ser un bloque de texto formateado o un micro-gráfico (ej. Recharts) si el tiempo de desarrollo lo permite.
* [cite_start]**`LegalDisclaimer.jsx`:** Texto estático resaltado en rojo o gris que indica explícitamente que no es asesoría y no garantiza resultados[cite: 41].

## 3. Lógica de Negocio (Frontend)
1.  Cuando `selectedNewsId` cambia, el componente llama a `llmService.analyzeNews(newsText)`.
2.  Mientras se espera la respuesta, se muestra un estado de carga (Skeleton Loader) para mejorar la UX.
3.  La respuesta JSON de la IA alimenta los *props* de `ImpactBadge` y `PriceComparison`.