import Event, { IEvent } from "./modle";

// Get all
export async function getAll() {
  return Event.find().lean();
}

export async function getAllData() {
  return Event.find(
    {},
    {
      _id: 1,
      title: 1,
      description: 1,
      thumbnailUrl: 1,
      startTime: 1,
      endTime: 1,
      registrationStart: 1,
      registrationEnd: 1,
      location: 1,
      mode: 1,
      createdBy: 1,
      organizer: 1,
      domains: 1,
      registrationUserCount: 1,
      capacity: 1,
      isOpen: 1,
      status: 1,
      isPublished: 1,
      isFeatured: 1,
      slug: 1,
      tags: 1,
      category: 1,
      meta: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  ).lean();
}

// Create
export async function create(data: Partial<IEvent>) {
  const event = new Event(data);
  return await event.save();
}

// Update
export async function update(id: string, data: Partial<IEvent>) {
  return Event.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true, // ✅ ensures schema validation on updates
  });
}

// Delete
export async function remove(id: string) {
  return Event.findByIdAndDelete(id);
}

export async function getById(id: string) {
  try {
    const event = await Event.findById(id);
    return event;
  } catch (error) {
    throw new Error(`Error fetching event by id: ${error}`);
  }
}
