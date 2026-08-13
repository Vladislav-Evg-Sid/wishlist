import app from "./app.js";

const PORT = 8000;

// Startup
app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
