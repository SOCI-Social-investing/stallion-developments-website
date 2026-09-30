/* The four communities, as every card grid on the site shows them (home, communities,
   register, and "other communities" on each community page). Copy from the client's
   copy rewrite doc (2026-09-29): one line each, naming the home type and town. */

export interface Community {
  slug: string;          // folder under src/pages/communities/ = the URL
  name: string;
  town: string;          // card meta line
  status: string;        // badge on the card image
  selling: boolean;      // "Now selling" gets the solid badge, the rest the muted one
  line: string;          // one-line description
  cta: string;           // link label at the bottom of the card
  tags: string;          // filter tags on /communities/
  mark: string;          // monogram on placeholder cards (no rendering yet)
  image?: string;        // rendering, if there is one
  alt?: string;
}

export const communities: Community[] = [
  {
    slug: "maple-place",
    name: "Maple Place",
    town: "Bracebridge, Muskoka",
    status: "Now selling",
    selling: true,
    line: "Semi-detached homes with finished lower levels, a short walk to downtown.",
    cta: "Get floor plans & pricing",
    tags: "muskoka selling",
    mark: "MP",
    image: "assets/img/maple-exterior.webp",
    alt: "Maple Place semi-detached homes on Maple Street, Bracebridge, front exterior rendering",
  },
  {
    slug: "anglo-street",
    name: "Anglo Street",
    town: "Bracebridge, Muskoka",
    status: "Delivering Q4 2028",
    selling: false,
    line: "Semi-detached homes on a 1-acre site.",
    cta: "Join the waitlist",
    tags: "muskoka soon",
    mark: "AS",
  },
  {
    slug: "chicopee-heights",
    name: "Chicopee Heights",
    town: "Kitchener",
    status: "Delivering Q4 2028",
    selling: false,
    line: "Detached family homes on 3 acres near Chicopee Ski & Summer Resort.",
    cta: "Register interest",
    tags: "kitchener soon",
    mark: "CH",
  },
  {
    slug: "lady-of-the-woods",
    name: "Lady of the Woods",
    town: "Prince Edward County",
    status: "Coming 2029",
    selling: false,
    line: "22 estate homes on 1-acre lots near Picton, in the heart of wine country.",
    cta: "Register for early access",
    tags: "pec soon",
    mark: "LW",
  },
];
