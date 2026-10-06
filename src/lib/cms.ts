/* Blog posts from the Stallion CMS (Payload), fetched once at build time.
   Only published posts are visible to anonymous requests, so no token is needed.
   Any CMS failure throws and fails the build on purpose: a failed build leaves the
   current live site up, while an empty blog would delete every live post. */

export const CMS_URL = (import.meta.env.CMS_URL || "https://stallion-cms.eng-224.workers.dev").replace(/\/+$/, "");

export interface Media {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string | null;
  /** Media doc at depth=1; its url is already absolute here (see cmsAsset) */
  heroImage: Media | null;
  /** Ready-made HTML of the body */
  contentHtml: string;
  meta?: { title?: string | null; description?: string | null } | null;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
}

/** CMS media paths (/api/media/file/x.webp) → absolute URLs on the CMS */
export const cmsAsset = (path: string) => (/^[a-z]+:/i.test(path) ? path : CMS_URL + "/" + path.replace(/^\//, ""));

// Images uploaded inside the body come through as root-relative CMS paths too
const absolutizeMedia = (html: string) => html.replace(/(\s(?:src|href)=["'])\/api\//g, `$1${CMS_URL}/api/`);

async function fetchAll(): Promise<Post[]> {
  const posts: Post[] = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({
      "where[_status][equals]": "published",
      sort: "-publishedAt",
      limit: "500",
      depth: "1",
      page: String(page),
    });
    const endpoint = `${CMS_URL}/api/posts?${query}`;
    let res: Response;
    try {
      res = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
    } catch (err) {
      throw new Error(`CMS: could not reach ${endpoint} (${(err as Error).message}). Build stopped so the live blog is kept.`);
    }
    if (!res.ok) throw new Error(`CMS: ${endpoint} answered ${res.status} ${res.statusText}. Build stopped so the live blog is kept.`);
    const body = await res.json().catch(() => null);
    if (!body || !Array.isArray(body.docs)) throw new Error(`CMS: ${endpoint} did not return a { docs: [] } list. Build stopped so the live blog is kept.`);
    posts.push(...body.docs);
    if (!body.hasNextPage) break;
  }

  return posts.map((p) => {
    if (!p.slug || !p.title) throw new Error(`CMS: published post ${p.id} has no ${p.slug ? "title" : "slug"}. Fix it in the CMS; build stopped.`);
    return {
      ...p,
      excerpt: p.excerpt || null,
      heroImage: p.heroImage?.url ? { ...p.heroImage, url: cmsAsset(p.heroImage.url) } : null,
      contentHtml: absolutizeMedia(p.contentHtml || ""),
    };
  });
}

// The index page and every post page share one request per build
let cache: Promise<Post[]> | undefined;

/** All published posts, newest first */
export function getPublishedPosts(): Promise<Post[]> {
  cache ??= fetchAll().then((posts) => posts.sort((a, b) => postDate(b).localeCompare(postDate(a))));
  return cache;
}

/** ISO date a post counts as published on */
export const postDate = (p: Post) => p.publishedAt || p.createdAt;

/** "October 6, 2026" in Ontario time */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Toronto" });
