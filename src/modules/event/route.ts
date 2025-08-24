import { Router } from "express";

import { authenticateToken } from "../../core/middlewares/auth";

import {
  getEventById,
  getAllEvents,
  getAllEventsData,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./controller/eventController";

const router = Router();

//GET
router.get("/", getAllEvents);
router.get("/data", authenticateToken, getAllEventsData);
router.get("/:identifier", authenticateToken, getEventById);

//POST
router.post("/create", authenticateToken, createEvent);

//PUT Update event by ID
router.put("/:id", authenticateToken, updateEvent);

//DELETE Delete event by ID
router.delete("/:id", authenticateToken, deleteEvent);

export default router;
