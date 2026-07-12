/**
 * Corre un único ciclo de ingesta y termina. Útil para:
 *  - probar credenciales de Finnhub/Quiver manualmente
 *  - correr la ingesta desde un cron externo (systemd timer, GitHub Actions, etc.)
 *    en vez de mantener el proceso Node vivo con node-cron.
 *
 * Uso: npm run ingest:once
 */
const { runIngestCycle } = require("../services/ingestService");
const prisma = require("../lib/prisma");

runIngestCycle()
  .then((resumen) => {
    console.log("Ingesta completada:", resumen);
    return prisma.$disconnect();
  })
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error("Ingesta falló:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
