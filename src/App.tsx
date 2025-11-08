import React from "react";
import {CalendarView} from "./components/Calendar/CalendarView";
import { useEventManager } from "./hooks/useEventManager";

const App: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
     
      <h1 className="text-2xl font-semibold mb-4 text-center">My Calendar</h1>

      <CalendarView
        events={events}
        onEventAdd={addEvent}
        onEventUpdate={updateEvent}
        onEventDelete={deleteEvent}
      />
    </div>
  );
};

export default App;
