import { defineConfig } from "cypress";

export default defineConfig({
  video:false,
  component: {
    video: false,
    supportFile: "cypress/support/component.ts",
    specPattern: "**/*.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
