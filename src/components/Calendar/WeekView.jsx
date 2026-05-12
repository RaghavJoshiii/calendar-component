import React from "react";
import {
  startOfWeek,
  addDays,
  isSameDay,
  format,
} from "date-fns";

// Height settings
const HOUR_HEIGHT = 48;
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

export const WeekView = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventDelete,
}) => {
  const start = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper for minute-based positioning
  const getMinutes = (date) => date.getHours() * 60 + date.getMinutes();

  return (
    <div className="animate-fade-in w-full overflow-x-auto">
      {/* Weekday Header */}
      <div className="grid grid-cols-8 mb-1 text-xs font-semibold text-neutral-700">
        <div></div>
        {days.map((day) => (
          <div key={day.toISOString()} className="text-center">
            {format(day, "EEE d")}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-8 border-t border-neutral-300 rounded-lg overflow-hidden shadow-card">
        
        {/* Hour gutter */}
        <div className="bg-neutral-50">
          {hours.map((h) => (
            <div
              key={h}
              className="h-12 border-b border-neutral-200 text-[10px] text-right pr-2 pt-1 text-neutral-500"
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayEvents = events.filter((e) =>
            isSameDay(new Date(e.startDate), day)
          );

          return (
            <div
              key={day.toISOString()}
              role="button"
              aria-label={`Date ${format(day, "PPP")}`}
              className="border-l border-neutral-200 bg-white relative"
              onClick={() => onDateClick(day)}
              style={{ height: `${24 * HOUR_HEIGHT}px` }}
            >
              {/* Hour rows */}
              {hours.map((h) => (
                <div
                  key={h}
                  className="h-12 border-b border-neutral-100 hover:bg-primary-50/20 transition-colors pointer-events-none"
                ></div>
              ))}

              {/* Events rendered absolutely */}
              {dayEvents.map((e) => {
                const start = new Date(e.startDate);
                const end = new Date(e.endDate);

                const startMin = getMinutes(start);
                const endMin = Math.max(startMin + 30, getMinutes(end));

                const top = startMin * MINUTE_HEIGHT;
                const height = (endMin - startMin) * MINUTE_HEIGHT;

                return (
                  <div
                    key={e.id}
                    className="absolute left-1 right-1 rounded-md text-white text-[10px] px-2 py-1 cursor-pointer shadow-sm group"
                    style={{
                      top,
                      height,
                      backgroundColor: e.color || "#0ea5e9",
                    }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onEventClick(e);
                    }}
                  >
                    {/* Title */}
                    <div className="truncate font-medium">{e.title}</div>

                    {/* Time */}
                    <div className="opacity-90 text-[9px]">
                      {format(start, "HH:mm")} – {format(end, "HH:mm")}
                    </div>

                    {/* Hover delete icon */}
                    <button
                      aria-label="Delete event"
                      className="absolute top-1 right-1 text-white/90 hover:text-white opacity-0 group-hover:opacity-100 transition text-xs"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventDelete(e.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
