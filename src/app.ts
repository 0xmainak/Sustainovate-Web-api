import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// import { errorMiddleware } from "./core/middlewares/error.middleware";
import monRoutes from "./monRoutes"; // centralized route loader
import routes from "./routes"; // centralized route loader

const app: Application = express();

// --- Allowed Origins ---
const allowedOrigins = ["http://localhost:3000", "http://sustainovate.mainak.me"];

// --- Global middlewares ---
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true, // allow cookies/auth headers
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// --- API routes ---
app.use("/api", routes);

// --- MON routes ---
app.use("/monitor", monRoutes);

// --- Health check route ---
app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// --- Centralized error handling ---
// app.use(errorMiddleware);

export default app;
