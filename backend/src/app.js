const express = require("express");
const cors = require("cors");
const noticiasRoutes = require("./routes/noticias.routes");
const { runSafely } = require("./jobs/ingestJob");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/noticias", noticiasRoutes);

// Endpoint manual para disparar una ingesta on-demand (útil en demos/hackathon).
app.post("/api/ingest/run", async (_req, res) => {
  await runSafely("manual");
  res.json({ status: "ingest_triggered" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[app] Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
