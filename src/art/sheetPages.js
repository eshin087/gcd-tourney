// Fighter sheet pages (TOOL-060, ADR 0007): a pack of more than 256 frames ships as several sheets, sheet.png,
// sheet2.png ..., each at most 4096 x 4096 px (16 x 16 cells of 256 px), so a phone with a 4096 px texture limit draws
// every page at full size instead of a downscaled, blurry one. Frames keep one number straight through the pages:
// frame f is on page floor(f / pageFrames), at cell f % pageFrames of it. anims.json lists `pages` and `pageFrames`
// only when there is more than one page, so a one-page pack is what it always was. Plain math with no DOM: the game,
// the art review page and the Node tools share it.

// the tallest page in px: the texture limit of the phones the game targets
export const PAGE_PX = 4096;

// The file of page p (0-based): sheet.png, sheet2.png, sheet3.png ...
export const pageFile = (p) => (p ? `sheet${p + 1}.png` : 'sheet.png');

// The sheet files of a pack, in page order.
export function sheetFiles(meta) {
  return Array.isArray(meta?.pages) && meta.pages.length > 1 ? meta.pages : ['sheet.png'];
}

// Frames per page, or 0 for a one-page pack (every frame on sheet.png).
export function pageFrames(meta) {
  return Array.isArray(meta?.pages) && meta.pages.length > 1 && meta.pageFrames > 0 ? meta.pageFrames : 0;
}

// Where frame f is drawn: its page (0-based) and the top-left pixel of its cell on that page. cols defaults to the
// pack's own columns (the baked placeholder's caller passes the count its canvas holds).
export function frameCell(meta, f, cols = meta.columns) {
  const per = pageFrames(meta);
  const page = per ? Math.floor(f / per) : 0, k = per ? f - page * per : f;
  return { page, x: (k % cols) * meta.frameWidth, y: Math.floor(k / cols) * meta.frameHeight };
}
