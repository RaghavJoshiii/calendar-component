import React, { useCallback, useMemo } from "react";
import type { CalendarEvent } from "../../hooks/useEventManager";
import { cn } from "../../lib/utils";

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  events,
  isToday,
  isCurrentMonth,
  onClick,
  onEventClick,
}) => {
  const handleClick = useCallback(() => onClick(date), [date, onClick]);
  const eventCount = useMemo(() => events.length, [events]);
  const dayNumber = date.getDate();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${date.toDateString()}. ${eventCount} events.`}
      onClick={handleClick}
      className={cn(
        "border-b border-r border-neutral-200 p-2 h-28 overflow-hidden cursor-pointer transition-colors",
        !isCurrentMonth && "bg-neutral-50 text-neutral-400",
        isToday && "bg-primary-50",
        "hover:bg-neutral-100"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={cn(
            "text-sm font-medium",
            isToday ? "text-primary-600 font-bold" : "text-neutral-900"
          )}
        >
          {dayNumber}
        </span>
      </div>

      <div className="space-y-1">
        {events.slice(0, 3).map(event => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className="text-xs px-2 py-1 rounded text-white truncate"
            style={{ backgroundColor: event.color || "#0ea5e9" }}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <button
            className="text-xs text-primary-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            +{events.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
};
