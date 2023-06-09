import { defineConfig } from 'cypress';
// @ts-ignore

export default defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    baseUrl: 'https://tourmalinecore.github.io/React-Admin-Template',
    defaultCommandTimeout: 30000,
    video: false,
    setupNodeEvents(on, config) {
    },
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
