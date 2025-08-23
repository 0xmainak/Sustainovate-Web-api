/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Types, model, models, Model } from "mongoose";

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl?: string;

  // Timing
  startTime: Date;
  endTime: Date;
  registrationDeadline?: Date;

  // Location & mode
  location: string;
  mode: "online" | "offline" | "hybrid";

  // Ownership
  createdBy: Types.ObjectId[];
  organizer?: string;
  domains: string[];

  // Registration
  registrationUsers: Types.ObjectId[];
  registrationUserCount: number;
  capacity?: number;
  isOpen: boolean;

  // Management
  status: "draft" | "published" | "archived" | "cancelled";
  isPublished: boolean;
  isFeatured: boolean;
  slug: string;

  // Metadata
  tags: string[];
  category: string[];
  meta?: Record<string, any>;

  // System
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<IEvent>;

const EventSchema = new Schema<IEvent, EventModel>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // Time
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    registrationDeadline: { type: Date },

    // Location
    location: { type: String, required: true },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },
    thumbnailUrl: { type: String },

    // Ownership
    createdBy: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    organizer: { type: String },
    domains: {
      type: [String],
      required: true,
      validate: (v: string[]) => v.length > 0,
    },

    // Registration
    registrationUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    registrationUserCount: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, min: 1 },
    isOpen: { type: Boolean, default: true },

    // Status
    status: {
      type: String,
      enum: ["draft", "published", "archived", "cancelled"],
      default: "draft",
    },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true, lowercase: true },

    // Metadata
    tags: {
      type: [String],
    },
    category: {
      type: [String],
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// ✅ Indexes
EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ startTime: 1 });
EventSchema.index({ domains: 1 });
EventSchema.index({ tags: 1, category: 1 });
EventSchema.index({ title: "text", description: "text" });

const Event = (models.Event as EventModel) || model<IEvent, EventModel>("Event", EventSchema);

export default Event;
