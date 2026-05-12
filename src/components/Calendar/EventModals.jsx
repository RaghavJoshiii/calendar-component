import React, { useState, useEffect } from "react";

const toLocalInput = (d) => {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
};

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  existingEvent,
  selectedDate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#0ea5e9");

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description || "");
      setStart(toLocalInput(existingEvent.startDate));
      setEnd(toLocalInput(existingEvent.endDate));
      setColor(existingEvent.color || "#0ea5e9");
    } else if (selectedDate) {
      const v = toLocalInput(selectedDate);
      setStart(v);
      setEnd(v);
      setDescription("");
    }
  }, [existingEvent, selectedDate]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const save = () => {
    if (!title.trim()) return;

    const evt = {
      id: existingEvent?.id || Math.random().toString(36).slice(2),
      title,
      description,
      startDate: new Date(start),
      endDate: new Date(end),
      color,
    };

    onSave(evt);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={existingEvent ? "Edit Event" : "Add Event"}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-modal animate-fade-in">
        <h2 className="text-lg font-semibold mb-4">
          {existingEvent ? "Edit Event" : "Add Event"}
        </h2>

        <div className="space-y-3">
          {/* Title */}
          <input
            className="w-full border rounded p-2"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <textarea
            className="w-full border rounded p-2 h-20 resize-none"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Start */}
          <label className="block text-sm">
            Start
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>

          {/* End */}
          <label className="block text-sm">
            End
            <input
              type="datetime-local"
              className="w-full border rounded p-2"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>

          {/* Color Picker */}
          <label className="block text-sm">
            Color
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 ml-2"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-3 py-2 bg-neutral-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 bg-primary-500 text-white rounded"
            onClick={save}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
