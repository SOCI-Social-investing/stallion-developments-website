// Build guard: runs before `npm run build` and `npm run dev` (prebuild / predev in
// package.json), so it also runs on Cloudflare Pages. It stops the build before Astro
// loads any config file if the repo shows signs of the PolinRider malware, which
// poisoned this repo in September 2026 through rewritten git history:
//   - .vscode/tasks.json that runs something on folder open, or settings that allow it
//   - fake font files (fa-solid-*.woff2 / *.llf) that are really JavaScript
//   - obfuscated code appended to a file after a long run of spaces or tabs
//   - its marker strings, and the file names it adds to .gitignore
// Plain Node, no dependencies: it has to be safe to run on a poisoned checkout.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".git", "frames", "work", "videos", "key_frames"]);
const TEXT = /\.(m?js|cjs|ts|tsx|jsx|json|astro|md|ya?ml|css|html|txt|toml)$|(^|\/)\.gitignore$|_redirects$/;
const MARKERS = /global\.i\s*=\s*'|global\['_V'\]|global\['r'\]\s*=\s*require|_0x[0-9a-f]{4,}\(|temp_auto_push\.bat|temp_interactive_push\.bat|branch_structure\.json/;
const PADDED_CODE = /[ \t]{150,}\S/;

const problems = [];
const flag = (file, why) => problems.push(`${relative(root, file)}: ${why}`);

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(path);
      continue;
    }
    if (/\.llf$/i.test(name)) flag(path, "fake font file (.llf)");
    if (/\.woff2?$/i.test(name)) {
      const magic = readFileSync(path).subarray(0, 4).toString("latin1");
      if (magic !== "wOF2" && magic !== "wOFF") flag(path, "font file that is not a font");
    }
    if (!TEXT.test(path) || st.size > 5_000_000) continue;
    const text = readFileSync(path, "utf8");
    if (path.endsWith("tools/guard.mjs")) continue; // this file names the markers
    if (MARKERS.test(text)) flag(path, "contains a known malware marker");
    if (PADDED_CODE.test(text)) flag(path, "code hidden after a long run of spaces or tabs");
    if (/\.vscode\/tasks\.json$/.test(path) && /folderOpen/.test(text)) flag(path, "task that runs automatically when the folder is opened");
    if (/\.vscode\/settings\.json$/.test(path) && /"task\.allowAutomaticTasks"\s*:\s*(true|"on")/.test(text)) flag(path, "enables automatic tasks");
  }
}

walk(root);

if (problems.length) {
  console.error("\nBuild stopped: this checkout shows signs of the PolinRider malware.\n");
  for (const p of problems) console.error("  - " + p);
  console.error("\nDo not build, run or open this checkout in an editor. See the incident notes.\n");
  process.exit(1);
}
console.log("guard: no malware signs found");
