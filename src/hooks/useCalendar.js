import { useState, useCallback } from "react";

/**
 * Simple calendar controller with both month and week navigation.
 * Keep all date math in here so views stay dumb.
 */
export const useCalendar = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // ----- Month nav -----
  const goToNextMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  // ----- Week nav (FIX: move by 7 days, not by month) -----
  const goToNextWeek = useCallback(() => {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + 7);
      return nd;
    });
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate((d) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() - 7);
      return nd;
    });
  }, []);

  return {
    currentDate,
    setCurrentDate,
    goToToday,
    goToNextMonth,
    goToPreviousMonth,
    goToNextWeek,
    goToPreviousWeek,
  };
};
