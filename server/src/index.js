import { loadConfig } from "./config.js";
import { createApp } from "./app.js";
const config = loadConfig();
const app = await createApp(config);
const server = app.listen(config.port, config.host, () =>
  console.log("BioNut: http://" + config.host + ":" + config.port),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () =>
    server.close(() => {
      app.locals.close();
      process.exit(0);
    }),
  );
