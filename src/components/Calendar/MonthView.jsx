import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  differenceInCalendarDays,
  format,
} from "date-fns";

const WEEK_COLS = 7;
const GRID_CELLS = 42;

export const MonthView = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventDelete,
}) => {
  // Build fixed 6x7 grid
  const gridStart = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
  const days = useMemo(
    () => Array.from({ length: GRID_CELLS }, (_, i) => addDays(gridStart, i)),
    [gridStart]
  );

  // Keep refs to cells to move focus programmatically
  const cellRefs = useRef([]);

  // --- Accessibility/Keyboard state
  const [gridActive, setGridActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Find today index (used when arrows first enter the grid)
  const today = new Date();
  const todayIndex = useMemo(() => {
    const diff = differenceInCalendarDays(today, gridStart);
    return diff >= 0 && diff < GRID_CELLS ? diff : 0;
  }, [gridStart]);

  // When gridActive or selectedIndex changes, move focus to selected cell
  useEffect(() => {
    if (!gridActive || selectedIndex === null) return;
    const el = cellRefs.current[selectedIndex];
    if (el) el.focus();
  }, [gridActive, selectedIndex]);

  // Click outside -> deactivate/deselect
  useEffect(() => {
    const onClickOutside = (e) => {
      const target = e.target;
      const inside = cellRefs.current.some((el) => el && el.contains(target));
      if (!inside) {
        setGridActive(false);
        setSelectedIndex(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Global key handler
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key;

      const isArrow =
        key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";

      if (!gridActive) {
        if (isArrow) {
          e.preventDefault();
          setGridActive(true);
          setSelectedIndex(todayIndex);
        }
        return;
      }

      if (key === "Tab") {
        setGridActive(false);
        setSelectedIndex(null);
        return;
      }

      if (key === "Escape") {
        e.preventDefault();
        setGridActive(false);
        setSelectedIndex(null);
        return;
      }

      if (selectedIndex === null) return;

      if (isArrow) {
        e.preventDefault();
        let next = selectedIndex;
        if (key === "ArrowRight") next = Math.min(GRID_CELLS - 1, selectedIndex + 1);
        if (key === "ArrowLeft") next = Math.max(0, selectedIndex - 1);
        if (key === "ArrowDown") next = Math.min(GRID_CELLS - 1, selectedIndex + WEEK_COLS);
        if (key === "ArrowUp") next = Math.max(0, selectedIndex - WEEK_COLS);
        setSelectedIndex(next);
        return;
      }

      if (key === "Enter" || key === " ") {
        e.preventDefault();
        onDateClick(days[selectedIndex]);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [gridActive, selectedIndex, todayIndex, days, onDateClick]);

  return (
    <div className="animate-fade-in">
      {/* Weekday header */}
      <div className="grid grid-cols-7 text-center font-semibold text-neutral-600 mb-2 select-none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-sm">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        role="grid"
        aria-label={format(currentDate, "MMMM yyyy")}
        className="grid grid-cols-7 gap-[1px] bg-neutral-200 rounded-lg overflow-hidden shadow-card"
      >
        {days.map((date, index) => {
          const inMonth = isSameMonth(date, currentDate);
          const isTodayCell = isSameDay(date, today);
          const isSelected = gridActive && selectedIndex === index;

          const dayEvents = events.filter((e) => isSameDay(new Date(e.startDate), date));

          return (
            <div
              key={date.toISOString()}
              role="button"
              aria-label={`Date ${format(date, "PPP")}. ${dayEvents.length} events.`}
              tabIndex={0}
              ref={(el) => {
                cellRefs.current[index] = el;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onDateClick(date);
                }
              }}
              onClick={() => {
                setGridActive(true);
                setSelectedIndex(index);
                onDateClick(date);
              }}
              className={cn(
                "h-28 p-2 relative cursor-pointer transition-colors duration-200 outline-none",
                inMonth ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-400",
                "hover:bg-primary-100",
                isTodayCell && "border border-primary-500 text-primary-700 font-semibold",
                isSelected && "bg-primary-100 ring-2 ring-primary-500/40"
              )}
            >
              <div className="text-right text-xs select-none">{format(date, "d")}</div>

              {/* Events in this day */}
              <div className="space-y-1 mt-1 overflow-y-auto max-h-[70%] pr-1">
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    role="button"
                    aria-label={`Event: ${e.title}`}
                    tabIndex={0}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") onEventClick(e);
                    }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onEventClick(e);
                    }}
                    className="group relative text-[10px] truncate rounded px-1 py-[2px] text-white cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: e.color || "#0ea5e9" }}
                  >
                    {e.title}

                    {/* Hover delete (×) with no background */}
                    <button
                      aria-label="Delete event"
                      title="Delete"
                      className="absolute top-0 right-1 text-[11px] leading-none opacity-0 group-hover:opacity-100 transition"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventDelete(e.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <button
                    className="text-[10px] text-primary-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
