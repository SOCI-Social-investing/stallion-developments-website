/* The home page film: the original deconstruction plus the generated cutaways
   from tools/kie.py, and the timeline that maps scroll onto them.
   Text beats in src/pages/index.astro reference these segment ids. */

export const sources = {
  film:     { dir: "frames",          prefix: "frame_", count: 246 }, // 6 clips @12fps
  bedroom:  { dir: "frames/bedroom",  prefix: "br_",    count: 61  }, // cutaway: rise into the upper floor
  living:   { dir: "frames/living",   prefix: "lv_",    count: 61  }, // cutaway: front door into the living room
  kitchen:  { dir: "frames/kitchen",  prefix: "kt_",    count: 61  }, // living room through to the kitchen
  deck:     { dir: "frames/deck",     prefix: "dk_",    count: 61  }, // kitchen out to the deck
  backyard: { dir: "frames/backyard", prefix: "by_",    count: 61  }, // return leg: deck back through the frame to the street
  glow:     { dir: "frames/glow",     prefix: "gl_",    count: 61  }, // ending: dusk, windows warm up
};

type Ref = [keyof typeof sources, number];
type Segment = { id: string; units: number } & ({ from: Ref; to: Ref } | { hold: Ref });

/* Original clip frame ranges (0-based): 1:0–36  2:37–73  3:74–110  4:111–147  5:148–184  6:185–245 */
export const timeline: Segment[] = [
  { id: "hero",   units: 0.9,  hold: ["film", 0] },                         // hero hold — the finished home
  { id: "clip1",  units: 1.0,  from: ["film", 0],      to: ["film", 36] },  // roof lifts
  { id: "hold1",  units: 0.15, hold: ["film", 36] },
  { id: "clip2",  units: 1.0,  from: ["film", 37],     to: ["film", 73] },  // upper floor strips
  { id: "hold2",  units: 0.1,  hold: ["film", 73] },
  { id: "brfwd",  units: 0.9,  from: ["bedroom", 0],   to: ["bedroom", 60] }, // rise into the bedroom
  { id: "brhold", units: 0.5,  hold: ["bedroom", 60] },
  { id: "brrev",  units: 0.6,  from: ["bedroom", 60],  to: ["bedroom", 0] },  // and back out
  { id: "hold2b", units: 0.1,  hold: ["film", 73] },
  { id: "clip3",  units: 1.0,  from: ["film", 74],     to: ["film", 110] }, // ground floor strips
  { id: "hold3",  units: 0.1,  hold: ["film", 110] },
  { id: "lvfwd",  units: 0.9,  from: ["living", 0],    to: ["living", 60] },  // through the front door into the living room
  { id: "lvhold", units: 0.4,  hold: ["living", 60] },
  { id: "ktfwd",  units: 0.9,  from: ["kitchen", 0],   to: ["kitchen", 60] }, // through to the kitchen
  { id: "kthold", units: 0.4,  hold: ["kitchen", 60] },
  { id: "dkfwd",  units: 0.9,  from: ["deck", 0],      to: ["deck", 60] },    // out the rear doors to the deck
  { id: "byhold", units: 0.5,  hold: ["backyard", 60] },
  { id: "byrev",  units: 0.6,  from: ["backyard", 60], to: ["backyard", 0] }, // and back out
  { id: "hold3b", units: 0.1,  hold: ["film", 110] },
  { id: "clip4",  units: 1.0,  from: ["film", 111],    to: ["film", 147] }, // down to the lot
  { id: "hold4",  units: 0.15, hold: ["film", 147] },
  { id: "clip5",  units: 1.0,  from: ["film", 148],    to: ["film", 184] }, // it rebuilds
  { id: "hold5",  units: 0.15, hold: ["film", 184] },
  { id: "clip6",  units: 1.2,  from: ["film", 185],    to: ["film", 245] }, // rise to aerial
  { id: "glow",   units: 0.9,  from: ["glow", 0],      to: ["glow", 60] },  // dusk, windows warm up
  { id: "end",    units: 0.3,  hold: ["glow", 60] },
];

/* Hero + most of clip 1 must be in before the loader lifts */
export const preload: Ref = ["film", 40];

/* Dark wash for the aerial stats moment */
export const overlay = { enter: "clip6:0.12", leave: "glow:0.97", max: 0.9, fade: 0.03 };

/* Oversized sliding line during the rebuild */
export const marquee = { text: "Built with intent.", enter: "hold4:0.4", leave: "hold5:0.9" };
