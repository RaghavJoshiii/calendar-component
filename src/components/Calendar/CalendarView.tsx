import React, { useState } from "react";
import { useCalendar } from "../../hooks/useCalendar";
import { EventModal } from "./EventModals";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import type { CalendarEvent } from "../../hooks/useEventManager";

export const CalendarView: React.FC<{
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
}> = ({ events, onEventAdd, onEventUpdate, onEventDelete }) => {
  const {
    currentDate,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    goToNextWeek,
    goToPreviousWeek,
  } = useCalendar();

  const [view, setView] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNewEvent = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  // Use week nav in week view; month nav in month view
  const goPrev = () => (view === "week" ? goToPreviousWeek() : goToPreviousMonth());
  const goNext = () => (view === "week" ? goToNextWeek() : goToNextMonth());

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={goPrev}
          >
            ←
          </button>
          <button
            className="px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            className="px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={goNext}
          >
            →
          </button>
        </div>

        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>

        <button
          className="px-3 py-1 rounded bg-primary-500 text-white hover:bg-neutral-300 hover:text-gray-900"
          onClick={() => setView((v) => (v === "month" ? "week" : "month"))}
        >
          Switch to {view === "month" ? "Week" : "Month"} View
        </button>
      </div>

      {/* Body */}
      {view === "month" ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventDelete={onEventDelete}
          onDateClick={openNewEvent}
          onEventClick={openEditEvent}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventDelete={onEventDelete}
          onDateClick={openNewEvent}
          onEventClick={openEditEvent}
        />
      )}

      {/* Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(event) => {
          if (editingEvent) onEventUpdate(event.id, event);
          else onEventAdd(event);
        }}
        existingEvent={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};
