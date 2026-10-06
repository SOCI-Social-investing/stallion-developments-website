// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

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
  // Writes sitemap-index.xml + sitemap-0.xml from every built page (blog posts included).
  // The 404 page is built as /404/ but must not be listed.
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(new URL(page).pathname) })],
});
