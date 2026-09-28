// @ts-check
import { defineConfig } from "astro/config";

// Served from the GitHub Pages project path until the domain moves.
// When stalliondevelopments.com points here (or on Cloudflare), set base to "/".
export default defineConfig({
  site: "https://alyelgohary-isl.github.io",
  base: "/stallion-developments-website/",
  trailingSlash: "always",
  build: { format: "directory" },
  // Astro 7 defaults to JSX whitespace rules, which drop line breaks between
  // inline elements in hand-written copy. `true` compresses losslessly instead.
  compressHTML: true,
  // tools/*.mjs QA scripts expect the dev/preview server here
  server: { port: 8014 },
});
