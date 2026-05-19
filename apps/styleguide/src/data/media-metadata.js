/**
 * Media metadata — hand-authored sidecar layered on top of the photoIndexPlugin
 * filesystem walk.
 *
 * Keyed by file `src` (the same path photoIndexPlugin emits). All fields are
 * optional. Files without an entry render with folder-derived defaults.
 *
 * Schema:
 *   crossPostTo: string[]  surface this file under additional sections too,
 *                          alongside its actual folder. Format: 'category' or
 *                          'category/subcategory' (e.g., 'collections/creation-1').
 *   tags:        string[]  cross-cutting filter axis (filter only — does NOT
 *                          relocate the file to another section).
 *   title:       string    overrides the auto-derived filename label.
 *   credits:     string    surfaces in the lightbox caption.
 *   year:        number    for future structured filtering / sorting.
 *   season:      string    e.g. 'SS16', 'AW20'.
 *   featured:    boolean   for cover-art / hero pickers.
 *
 * Orphans are harmless — keys with no matching file are silently ignored at
 * lookup time. Safe to leave stale entries when files are deleted.
 */

export const MEDIA_METADATA = {
  '/brand/video/ac-rff-2015-srt.mp4': {
    crossPostTo: ['collections/creation-1'],
    tags: ['runway', '2015'],
    title: 'Reykjavík Fashion Festival 2015 — Creation 1',
    year: 2015,
  },
}
