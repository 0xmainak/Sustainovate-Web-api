import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// import { errorMiddleware } from "./core/middlewares/error.middleware";
import routes from "./routes"; // centralized route loader
import client,{ collectDefaultMetrics } from "prom-client";

const app: Application = express();
collectDefaultMetrics({ register: client.register });

// --- Allowed Origins ---
// const allowedOrigins = ["http://localhost:3000"];

// --- Global middlewares ---
// app.use(
//   cors({
//     origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed for this origin: " + origin));
//       }
//     },
//     credentials: true, // allow cookies/auth headers
//   }),
// );
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// --- API routes ---
app.use("/api", routes);

// --- MON routes ---
app.get("/metrics", async (_, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (ex) {
    res.status(500).end(ex);
  }
});


// --- Health check route ---
app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// --- Centralized error handling ---
// app.use(errorMiddleware);

export default app;
