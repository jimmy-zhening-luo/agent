import path from "node:path";
import express from "express";
import ViteExpress from "vite-express";

const app = express();
ViteExpress.config({ mode: "production" });

app.use(express.static(
  // directory named "dist" in the current directory
  path.join(process.cwd(), "dist"),
));

app.get(
  "/health",
  (
    _,
    res,
  ) => res.send("OK"),
);

const server = app.listen(
  3000,
  "0.0.0.0",
);

ViteExpress.bind(app, server);
