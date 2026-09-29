/* Form handler: Cloudflare Pages Function at POST /api/lead.
   Every form on the site posts here (public/js/config.js → formEndpoint) as multipart
   FormData from src/scripts/site.js, and each accepted submission is emailed through
   Resend to the Stallion inbox. A 2xx reply is what fires the GA4 generate_lead event,
   so any failure must answer with an error status, never a fake success.

   Cloudflare Pages → Settings → Variables and Secrets:
     RESEND_API_KEY  (secret, required)  Resend key with "Sending access" to mail.stalliondevelopments.com
     LEAD_TO         (optional)          defaults to info@stalliondevelopments.com
     LEAD_FROM       (optional)          defaults to Stallion Website <website@mail.stalliondevelopments.com> */

const DEFAULT_TO = "info@stalliondevelopments.com";
const DEFAULT_FROM = "Stallion Website <website@mail.stalliondevelopments.com>";
// Hosts allowed to post: the production domain and the Cloudflare preview/production URLs
const ALLOWED_HOSTS = /^(www\.)?stalliondevelopments\.com$|(^|\.)stallion-developments\.pages\.dev$/;
// Added by site.js or third-party scripts; never shown as lead fields
const INTERNAL = new Set(["_gotcha", "_subject", "form", "page", "g-recaptcha-response", "cf-turnstile-response"]);
const MAX_FIELDS = 40;
const MAX_VALUE = 5000;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// "first_name" → "First name"
const label = (key) => (key.charAt(0).toUpperCase() + key.slice(1)).replace(/[_-]+/g, " ");

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin) {
    let host = "";
    try { host = new URL(origin).hostname; } catch {}
    if (!ALLOWED_HOSTS.test(host)) return json(403, { ok: false, error: "origin" });
  }
  if (!env.RESEND_API_KEY) return json(500, { ok: false, error: "not configured" });

  let data;
  try { data = await request.formData(); } catch { return json(400, { ok: false, error: "bad form" }); }

  // Honeypot filled in = a bot. Answer like a success so it moves on, but send nothing.
  if (String(data.get("_gotcha") || "").trim()) return json(200, { ok: true });

  const fields = [];
  for (const [key, value] of data.entries()) {
    if (INTERNAL.has(key) || typeof value !== "string") continue;
    const v = value.trim();
    if (!v) continue;
    if (fields.length >= MAX_FIELDS || v.length > MAX_VALUE) return json(413, { ok: false, error: "too large" });
    fields.push([key, v]);
  }

  const email = (fields.find(([k]) => k === "email") || [])[1] || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false, error: "email" });

  const form = String(data.get("form") || "website").slice(0, 80);
  const page = String(data.get("page") || "").slice(0, 300);
  const subject = String(data.get("_subject") || `Stallion website: ${form}`).replace(/[\r\n]+/g, " ").slice(0, 150);

  const rows = fields.map(([k, v]) => [label(k), v]);
  if (page) rows.push(["Page", page]);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<p style="font:14px/1.5 sans-serif">New submission from the <strong>${escapeHtml(form)}</strong> form.</p>` +
    `<table style="font:14px/1.5 sans-serif;border-collapse:collapse">` +
    rows.map(([k, v]) =>
      `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${escapeHtml(k)}</td>` +
      `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("") +
    `</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.LEAD_FROM || DEFAULT_FROM,
      to: [env.LEAD_TO || DEFAULT_TO],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) return json(502, { ok: false, error: "send failed" });
  return json(200, { ok: true });
}

export const onRequest = () => json(405, { ok: false, error: "method" });
