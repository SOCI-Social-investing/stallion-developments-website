/* Stallion Developments — site configuration (edit this file only)
   ------------------------------------------------------------------
   FORMS. Every form on the site posts to /api/lead, a Cloudflare Pages Function
   (functions/api/lead.js) that emails each submission through Resend from
   website@mail.stalliondevelopments.com to info@ and r.moussa@stalliondevelopments.com, with the
   visitor's address as Reply-To. The form name and page are in the subject and body
   so the team can tell registrations apart. The function needs the RESEND_API_KEY
   secret in Cloudflare Pages → Settings → Variables and Secrets.

   /api/lead only exists on Cloudflare Pages (stallion-developments.pages.dev and the
   production domain). On the GitHub Pages copy, forms show the error message.

   SPAM. A hidden honeypot field is always included, and the function drops any
   submission that fills it. recaptchaSiteKey is unused for now (it was for Formspree).

   Leave formEndpoint empty and forms only show their local "sent" state without
   sending anything. */
window.SITE = {
  siteName: "Stallion website",   // email subjects read "Stallion website: contact"
  formEndpoint: "/api/lead",
  recaptchaSiteKey: "",
  notifyEmail: "info@stalliondevelopments.com",
};
