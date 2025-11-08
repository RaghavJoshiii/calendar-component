export const getMonthDays = (date: Date): Date[] => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days: Date[] = [];

  // previous month's days to fill grid
  for (let i = startDay - 1; i >= 0; i--) {
    days.push(new Date(date.getFullYear(), date.getMonth(), -i));
  }

  // current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // next month's filler days to complete the grid (total 42)
  while (days.length < 42) {
    days.push(
      new Date(date.getFullYear(), date.getMonth() + 1, days.length - daysInMonth - startDay + 1)
    );
  }

  return days;
};
