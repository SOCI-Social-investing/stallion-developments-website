/* Frame sequences on disk are numbered from 1 and zero-padded to 4 digits:
   frames/bedroom/br_0001.webp … (tools/frames.sh writes them this way). */
export const framePath = (prefix, i, ext = "webp") => `${prefix}${String(i + 1).padStart(4, "0")}.${ext}`;

/* Resolves to the loaded image, or null if it failed (callers fall back to the nearest loaded frame). */
export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
