# Inteligencia de Mercado y Recomendaciones Financieras (Track 5)

## Descripción General
Este proyecto es un prototipo interactivo desarrollado en 48 horas enfocado en resolver la priorización de información financiera para asesores e inversionistas, asegurando un análisis profundo sin automatizar transacciones de mercado. El sistema captura eventos globales en tiempo real, evalúa su impacto utilizando Inteligencia Artificial (Large Language Model) y requiere la validación obligatoria de un analista humano.
## Arquitectura y Tecnologías
El prototipo opera bajo una arquitectura Frontend orientada a servicios:
* **Core:** React 18 + Vite para un empaquetado optimizado y renderizado rápido.
* **Estilos:** CSS Grid responsivo a 3 columnas con un sistema de diseño premium "Dark Mode" para interfaces financieras.
* **Gestión de Estado:** Manejo centralizado a través de `DashboardContext` y persistencia en memoria local (`useLocalStorageBriefings`).
* **Servicios Externos:** Integración paralela de APIs financieras (Finnhub, Alpha Vantage, Currents API).
  
## Historias de Usuario y Flujo Funcional

### 1. Radar de Noticias y Activos (HU1)
La plataforma consolida feeds de mercado en tiempo real desde múltiples fuentes simultáneas (Finnhub, Alpha Vantage y Currents API). Permite filtrar titulares por tipo de instrumento (Acciones, Criptoactivos, Crédito), identificar activos específicos mediante etiquetas interactivas y clasificar por antigüedad.

### 2. Señal Explicable de Impacto (HU2)
Al seleccionar un evento, el Agente IA evalúa la dirección del mercado (Positivo, Negativo, Neutral, Incierto) y calcula un nivel de confianza estadístico. La interfaz renderiza comparativas de precios históricos, la evidencia que respalda la decisión del modelo y un descargo de responsabilidad legal explícito indicando que no constituye asesoría financiera.

### 3. Briefing de Mercado y Aprobación Humana (HU3)
El flujo final exige la intervención del analista, quien revisa la propuesta de la IA y clasifica el estado del evento (Pendiente, Revisada, Escalada, Descartada). El sistema requiere una justificación técnica en texto libre y permite la creación de tareas o alertas para el equipo sin ejecutar operaciones comerciales directas.

## Proyección de Base de Datos
Actualmente el prototipo utiliza almacenamiento local para agilizar el desarrollo, pero se ha diseñado una arquitectura relacional (PostgreSQL/Supabase) para su futura migración. El esquema normaliza el catálogo de instrumentos, vincula de forma transaccional las noticias con los activos (`news_assets`) y separa el análisis del Agente IA de los datos crudos para optimizar consultas.

---

## Registro de Avances (Log)

### 11 de Julio de 2026
* **Inicialización:** Lectura de requerimientos, aprobación del plan de implementación y configuración del entorno Vite.
* **Diseño Global:** Implementación del layout en CSS Grid, tipografía Inter y paleta de colores institucional.
* **Estado Reactivo:** Construcción de la base de datos simulada y desarrollo de la lógica principal de búsqueda, filtrado y actualización de estados (`App.jsx`).

### 12 de Julio de 2026
* **Transición de Arquitectura:** Desacoplamiento del sistema monolítico hacia una capa de servicios (`finnhubService`, `alphaService`, `llmService`, `currentsService`).
* **Integración Currents API:** Implementación de la API como fuente paralela de noticias en tiempo real con sistema de respaldo (mock fallback) para garantizar disponibilidad.
* **Construcción de Componentes UI:** Finalización de la estructura de tres columnas (`NewsSidebar`, `ImpactDetail`, `BriefingPanel`) con filtros interactivos, modales de carga tipo "Skeleton" y notificaciones visuales temporales (Toasts).
* **Esquema de Datos:** Diseño del diagrama de entidad-relación y scripts de migración relacional.
