/* Site-root URLs that respect the deploy base ("/" on the domain,
   "/stallion-developments-website/" on GitHub Pages; set by BASE_PATH at build time).
   url("communities/") → "/stallion-developments-website/communities/" */
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export const url = (path = "") => (/^[a-z]+:/i.test(path) ? path : BASE + path.replace(/^\//, ""));

/* Canonical and OG URLs always point at the production domain (full URLs, e.g. CMS images, pass through). */
export const SITE_URL = "https://www.stalliondevelopments.com";
export const absolute = (path = "") => (/^[a-z]+:/i.test(path) ? path : `${SITE_URL}/${path.replace(/^\//, "")}`);
