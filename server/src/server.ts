import app from "./app.js";
import { config } from "./config/env.js";

// Startup
app.listen(config.port, () => {
  console.log(`Server started: http://localhost:${config.port}`);
});
