import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Default } from "./CalendarView.stories";

export default {
  title: "Calendar/InteractionTests",
};

export const AddEventTest = {
  ...Default,
  play: async ({ canvasElement }:{ canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    const day = canvas.getAllByLabelText(/Date/)[0];
    await userEvent.click(day);

    const titleInput = canvas.getByPlaceholderText("Event title");
    await userEvent.type(titleInput, "Storybook Test Event");

    const save = canvas.getByText("Save");
    await userEvent.click(save);

    expect(canvas.getByText("Storybook Test Event")).toBeInTheDocument();
  },
};
