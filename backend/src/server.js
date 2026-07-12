const app = require("./app");
const { port } = require("./config/env");
const { scheduleIngestJob } = require("./jobs/ingestJob");

app.listen(port, () => {
  console.log(`[server] API escuchando en http://localhost:${port}`);
  scheduleIngestJob();
});
