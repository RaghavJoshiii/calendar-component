import { useState, useCallback, useEffect } from "react";

// Helpers to ensure Date objects
const reviveEvent = (e) => ({
  ...e,
  startDate: new Date(e.startDate),
  endDate: new Date(e.endDate),
});

const LS_KEY = "calendar-events";

// Load from localStorage; if empty, fall back to seed
const loadInitial = (seed) => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(reviveEvent) : [];
    }
    return (seed || []).map(reviveEvent);
  } catch {
    return (seed || []).map(reviveEvent);
  }
};

export const useEventManager = (seed = []) => {
  const [events, setEvents] = useState(() => loadInitial(seed));

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(events));
    } catch {
      // ignore storage errors
    }
  }, [events]);

  const addEvent = useCallback((event) => {
    setEvents(prev => [...prev, reviveEvent(event)]);
  }, []);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev =>
      prev.map(e => (e.id === id ? reviveEvent({ ...e, ...updates }) : e))
    );
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return { events, addEvent, updateEvent, deleteEvent };
};
