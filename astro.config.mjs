// @ts-check
import { defineConfig } from "astro/config";

// BASE_PATH is set by the GitHub Pages workflow from GitHub's own answer
// ("/stallion-developments-website/" on the project site). Cloudflare Pages and
// the production domain serve from the root, so anywhere else it defaults to "/".
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site: "https://www.stalliondevelopments.com",
  base,
  trailingSlash: "always",
  build: { format: "directory" },
  // Astro 7 defaults to JSX whitespace rules, which drop line breaks between
  // inline elements in hand-written copy. `true` compresses losslessly instead.
  compressHTML: true,
  // tools/*.mjs QA scripts expect the dev/preview server here
  server: { port: 8014 },
});
