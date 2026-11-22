// ============================================================
// FILE:   backend/src/app.js
// STATUS: UPDATED - existing file, replace its whole content with this
// ============================================================
const fs = require("fs");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const language = require("./middleware/language");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

// NOTE: the system is normally hosted on the internal network over plain HTTP, so
// HSTS / "upgrade-insecure-requests" are disabled. Re-enable them if you add HTTPS.
app.use(
  helmet({
    hsts: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: { "upgrade-insecure-requests": null },
    },
  }),
);
app.use(cors({ origin: env.clientUrls, credentials: true }));
app.use(language); // sets req.lang / req.t from the Accept-Language header
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(morgan(env.isProd ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 2000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: (req) => ({
      success: false,
      message: req.t("common.tooManyRequests"),
    }),
  }),
);
app.use("/api", routes);

// Single-server deployment: if a built React app exists next to the backend (frontend/dist),
// Express serves it too. When the frontend is hosted elsewhere (e.g. Vercel) there is no
// dist folder, so this block is skipped and the server is a pure API.
const dist = path.join(__dirname, "../../frontend/dist");
if (env.isProd && fs.existsSync(path.join(dist, "index.html"))) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) =>
    res.sendFile(path.join(dist, "index.html")),
  );
} else {
  // Friendly answer for people (or Render's health check) opening the bare server address
  app.get("/", (_req, res) =>
    res.json({
      success: true,
      service: "Addis MESOB Gate Asset Control API",
      health: "/api/health",
    }),
  );
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
