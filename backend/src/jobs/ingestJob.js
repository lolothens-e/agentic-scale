const cron = require("node-cron");
const { ingest } = require("../config/env");
const { runIngestCycle } = require("../services/ingestService");

let isRunning = false;

async function runSafely(trigger) {
  if (isRunning) {
    console.warn(`[ingest] Ciclo (${trigger}) omitido: ya hay uno en curso.`);
    return;
  }
  isRunning = true;
  try {
    await runIngestCycle();
  } catch (err) {
    console.error(`[ingest] Error no controlado en el ciclo (${trigger}):`, err);
  } finally {
    isRunning = false;
  }
}

/** Registra el cron y, opcionalmente, dispara una corrida inmediata al bootear. */
function scheduleIngestJob() {
  if (!cron.validate(ingest.cronSchedule)) {
    console.error(
      `[ingest] INGEST_CRON_SCHEDULE inválido ("${ingest.cronSchedule}"). Job no programado.`
    );
    return;
  }

  cron.schedule(ingest.cronSchedule, () => runSafely("cron"));
  console.log(`[ingest] Job programado con schedule "${ingest.cronSchedule}"`);

  if (ingest.runOnBoot) {
    runSafely("boot");
  }
}

module.exports = { scheduleIngestJob, runSafely };
