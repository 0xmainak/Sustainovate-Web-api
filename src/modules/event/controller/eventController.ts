import { Request, Response, NextFunction } from "express";

import * as eventService from "../service"; // assumes you have CRUD methods there

// ✅ GET all events
export async function getAllEventsData(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventService.getAll();
    if (!events || events.length === 0) {
      return res.json({ success: true, data: [], message: "No events found" });
    }
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

// ✅ GET all events data
export async function getAllEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventService.getAllData();
    if (!events || events.length === 0) {
      return res.json({ success: true, data: [], message: "No events found" });
    }
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

// ✅ CREATE event
export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, startTime, endTime, location, mode, createdBy, slug } = req.body;

    // Basic validation (optional — replace with zod/joi later)
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !mode ||
      !createdBy ||
      !slug
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newEvent = await eventService.create(req.body);
    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    next(err);
  }
}

// ✅ UPDATE event
export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedEvent = await eventService.update(id, updateData);
    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: updatedEvent });
  } catch (err) {
    next(err);
  }
}

// ✅ DELETE event
export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const deleted = await eventService.remove(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    next(err);
  }
}
