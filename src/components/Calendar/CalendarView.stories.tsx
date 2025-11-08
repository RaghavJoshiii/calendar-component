import type { Meta, StoryObj } from "@storybook/react";

import { CalendarView } from "./CalendarView";
import { useEventManager } from "../../hooks/useEventManager";
import "../../styles/globals.css";

//  Wrapper so hooks can be used inside Storybook
const Wrapper = (props: any) => {
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(
    props.initialEvents || []
  );

  return (
    <div className="p-4 bg-neutral-50 min-h-screen">
      <CalendarView
        events={events}
        onEventAdd={addEvent}
        onEventUpdate={updateEvent}
        onEventDelete={deleteEvent}
      />
    </div>
  );
};

const meta: Meta<typeof Wrapper> = {
  title: "Calendar/CalendarView",
  component: Wrapper,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Wrapper>;

//  1. Default Month View
export const Default: Story = {
  args: {
    initialEvents: [
      {
        id: "1",
        title: "Team Meeting",
        description: "Weekly sync",
        startDate: new Date(),
        endDate: new Date(),
        color: "#0ea5e9",
      },
    ],
  },
};

//  2. Empty Calendar
export const Empty: Story = {
  args: {
    initialEvents: [],
  },
};

//  3. Many Events (Stress Test)
export const ManyEvents: Story = {
  args: {
    initialEvents: Array.from({ length: 30 }).map((_, i) => ({
      id: `ev-${i}`,
      title: `Event ${i + 1}`,
      description: "Sample event",
      startDate: new Date(2025, 0, (i % 28) + 1, (i % 6) + 8),
      endDate: new Date(2025, 0, (i % 28) + 1, (i % 6) + 9),
      color: i % 2 ? "#0ea5e9" : "#10b981",
    })),
  },
};

//  4. Week View Story
export const WeekViewStory: Story = {
  args: {
    initialEvents: [
      {
        id: "w1",
        title: "Workout",
        description: "",
        startDate: new Date(2025, 0, 14, 9),
        endDate: new Date(2025, 0, 14, 10),
        color: "#f59e0b",
      },
    ],
  },
};

// 5. Interactive Playground
export const Playground: Story = {
  args: {
    initialEvents: [],
  },
};

//  6. Interaction Test (Keyboard)
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;

    // Simulate arrow key into grid
    canvas.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );

    // Simulate Enter key to open modal
    canvas.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );

    // Simulate Escape to close modal
    canvas.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
  },
};
