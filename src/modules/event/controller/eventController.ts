import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import EventModel from "../../event/modle"; // ✅ make sure this is your mongoose schema
import * as eventService from "../service";
import { AuthRequest } from "../../../core/middlewares/auth";

// ✅ GET all events
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

// ✅ GET all events data
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

// ✅ Get Event By ID
export async function getEventById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await eventService.getById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

// ✅ Get Event By ID (full data)
export async function getEventByIdData(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await eventService.getByIdData(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

// ✅ CREATE event
export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      mode,
      createdBy,
      slug,
      registrationStart,
      registrationEnd,
      thumbnailUrl,
      domains, // <--- add this
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !mode ||
      !createdBy ||
      !slug ||
      !registrationStart ||
      !registrationEnd ||
      !thumbnailUrl ||
      !domains || // <--- must exist
      !Array.isArray(domains) || // <--- must be array
      domains.length === 0 // <--- must be non-empty
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields or domains empty" });
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

// ✅ Register / Unregister user for event
export async function registerEventById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { identifier } = req.params; // eventId
    const userId = req.user?._id; // current user id

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const event = await EventModel.findById(identifier);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const alreadyRegistered = event.registrationUsers?.some((u) => u.equals(userObjectId));

    let updatedEvent;
    if (alreadyRegistered) {
      updatedEvent = await EventModel.findByIdAndUpdate(
        identifier,
        { $pull: { registrationUsers: userObjectId } },
        { new: true },
      );
      return res.json({ success: true, data: updatedEvent, message: "Successfully unregistered" });
    } else {
      updatedEvent = await EventModel.findByIdAndUpdate(
        identifier,
        { $addToSet: { registrationUsers: userObjectId } }, // prevents duplicates
        { new: true },
      );
      return res.json({ success: true, data: updatedEvent, message: "Successfully registered" });
    }
  } catch (err) {
    next(err);
  }
}
