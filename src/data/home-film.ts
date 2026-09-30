/* The home page film: the original deconstruction plus the generated cutaways
   from tools/kie.py, and the timeline that maps scroll onto them.
   Text beats in src/pages/index.astro reference these segment ids.

   Since the client copy rewrite (2026-09-29) the film tells five frames and ends on
   the yard: exterior, the builder, natural light, open-concept living, the yard.
   The return leg, rebuild, aerial and dusk clips (frames 111–245, frames/backyard and
   frames/glow) are no longer played, so they are left out of the sources and never downloaded. */

export const sources = {
  film:     { dir: "frames",          prefix: "frame_", count: 111 }, // clips 1–3 of the original 6 @12fps
  bedroom:  { dir: "frames/bedroom",  prefix: "br_",    count: 61  }, // cutaway: rise into the upper floor
  living:   { dir: "frames/living",   prefix: "lv_",    count: 61  }, // cutaway: front door into the living room
  kitchen:  { dir: "frames/kitchen",  prefix: "kt_",    count: 61  }, // living room through to the kitchen
  deck:     { dir: "frames/deck",     prefix: "dk_",    count: 61  }, // kitchen out to the deck
};

type Ref = [keyof typeof sources, number];
type Segment = { id: string; units: number } & ({ from: Ref; to: Ref } | { hold: Ref });

/* Original clip frame ranges (0-based): 1:0–36  2:37–73  3:74–110 (4–6, 111–245, no longer played) */
export const timeline: Segment[] = [
  { id: "hero",   units: 0.9,  hold: ["film", 0] },                         // frame 1: the finished home
  { id: "clip1",  units: 1.0,  from: ["film", 0],      to: ["film", 36] },  // frame 2: roof lifts…
  { id: "hold1",  units: 0.15, hold: ["film", 36] },
  { id: "clip2",  units: 1.0,  from: ["film", 37],     to: ["film", 73] },  // …upper floor strips
  { id: "hold2",  units: 0.1,  hold: ["film", 73] },
  { id: "brfwd",  units: 0.9,  from: ["bedroom", 0],   to: ["bedroom", 60] }, // frame 3: rise into the bedroom
  { id: "brhold", units: 0.5,  hold: ["bedroom", 60] },
  { id: "brrev",  units: 0.6,  from: ["bedroom", 60],  to: ["bedroom", 0] },  // and back out
  { id: "hold2b", units: 0.1,  hold: ["film", 73] },
  { id: "clip3",  units: 0.7,  from: ["film", 74],     to: ["film", 110] }, // ground floor strips
  { id: "hold3",  units: 0.1,  hold: ["film", 110] },
  { id: "lvfwd",  units: 0.9,  from: ["living", 0],    to: ["living", 60] },  // frame 4: through the front door into the living room
  { id: "lvhold", units: 0.4,  hold: ["living", 60] },
  { id: "ktfwd",  units: 0.9,  from: ["kitchen", 0],   to: ["kitchen", 60] }, // through to the kitchen
  { id: "kthold", units: 0.4,  hold: ["kitchen", 60] },
  { id: "dkfwd",  units: 0.9,  from: ["deck", 0],      to: ["deck", 60] },    // frame 5: out the rear doors to the deck
  { id: "byhold", units: 0.6,  hold: ["deck", 60] },                        // the yard; the page takes over from here
];

/* Hero + most of clip 1 must be in before the loader lifts */
export const preload: Ref = ["film", 40];

/* Runway in viewport heights: the pace the old 1600/1150 runway had per unit, over 10.15 units */
export const length = { desktop: 1030, mobile: 740 };
