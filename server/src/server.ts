import app from "./app.js";
import { config } from "./config/env.js";
import { db } from "./db/knex.js";

await db.raw("select 1");
console.log("Database connected");

// Startup
app.listen(config.port, () => {
  console.log(`Server started: http://localhost:${config.port}`);

  console.log(`Swagger: http://localhost:${config.port}/api-docs`);
});
