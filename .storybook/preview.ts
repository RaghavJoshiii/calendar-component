import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: "fullscreen",
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
