import { Router } from "express";
import client, { collectDefaultMetrics } from "prom-client";

const router = Router();
// const collectDefaultMetrics = client.collectDefaultMetrics; // This line was redundant and has been removed.

// Call the imported function directly
collectDefaultMetrics({ register: client.register });

// Base route
router.get("/", (_, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Metrics endpoint
router.get("/metrics", async (_, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (ex) {
    res.status(500).end(ex);
  }
});

export default router;
