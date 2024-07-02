/**
 * @typedef {Object} TailwindConfig
 * @property {string[]} content - Elenco dei file da includere nel processo di build.
 * @property {Object} theme - Estensioni personalizzate per il tema Tailwind CSS.
 */

/**
 * Configurazione per le impostazioni di Tailwind CSS.
 * 
 * @type {TailwindConfig}
 */
const config = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
      extend: {},
  },
};

export default config;
