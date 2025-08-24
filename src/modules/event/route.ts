import { Router } from "express";

import { authenticateToken } from "../../core/middlewares/auth";
import { requireAdminOrModerator, requireModerator } from "../../core/middlewares/admin";

import {
  getEventByIdData,
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
router.get("/:identifier", authenticateToken, getEventById);
router.get("/data", authenticateToken, requireModerator, getAllEventsData);
router.get("/data/:identifier", authenticateToken, requireModerator, getEventByIdData);

//POST
router.post("/create", authenticateToken, requireAdminOrModerator, createEvent);

//PUT Update event by ID
router.put("/:id", authenticateToken, requireAdminOrModerator, updateEvent);

//DELETE Delete event by ID
router.delete("/:id", authenticateToken, requireAdminOrModerator, deleteEvent);

export default router;
