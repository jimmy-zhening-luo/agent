import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/health", (_, res) => res.send("OK"));

ViteExpress.listen(app, 3000);
