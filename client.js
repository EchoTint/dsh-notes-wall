window.__ModuleLoader__.load({
  id: 'dsh-notes-wall',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'notesWall';
    const PANEL_ID = 'notes-wall';
    const STORAGE_KEY = 'dsh.notes-wall.notes.v1';
    const MAX_NOTES = 500;

    /* The notes are paper: their colors are content, not chrome. Everything
       around them is drawn with the host's semantic theme tokens. */
    const COLORS = [
      { id: 'amber', paper: '#f7e7c2', ink: '#4a3810', edge: '#ebd9ac', pin: '#edcba0, #c29a4e 55%, #8e6b28' },
      { id: 'rose', paper: '#f5dfde', ink: '#5a3138', edge: '#ebd0cf', pin: '#d9a3a6, #a2626a 55%, #6e3d45' },
      { id: 'mint', paper: '#dfede2', ink: '#2f4c3a', edge: '#cfe0d4', pin: '#afcbb4, #7a9c83 55%, #4e6e58' },
      { id: 'sky', paper: '#dee9f2', ink: '#2f4557', edge: '#cfdeea', pin: '#a9c3d8, #6f8fa9 55%, #456079' },
      { id: 'lilac', paper: '#e6e2f0', ink: '#453a5c', edge: '#d8d2e6', pin: '#c3b7d4, #8c7ca6 55%, #5e5177' },
      { id: 'sand', paper: '#f0e8d8', ink: '#453c2c', edge: '#e2d7c1', pin: '#cdbea4, #9c8a6c 55%, #6e5f45' },
    ];

    const zh = {
      panel: '便签墙',
      title: '便签墙',
      kicker: '灵感速记',
      lead: '想法来的那一刻就写下来，停笔一会儿它就存好了。',
      newNote: '新建便签',
      searchLabel: '搜索便签',
      searchPlaceholder: '搜索便签…',
      clearSearch: '清除搜索',
      export: '导出',
      import: '导入',
      exported: '已导出 {n} 条便签',
      imported: '已导入 {n} 条便签',
      exportEmpty: '还没有便签可以导出',
      exportFailed: '导出失败：浏览器不允许下载文件',
      importFailed: '导入失败：不是有效的便签文件',
      emptyTitle: '墙上还是空的',
      emptyBody: '写下第一个念头吧，它会一直留在这面墙上。',
      emptyAction: '写下第一条',
      placeholder: '写点什么…',
      saved: '已保存',
      saveFailed: '保存失败，浏览器存储不可用',
      count: '{n} 条便签',
      pinnedCount: '{n} 条置顶',
      noMatches: '没有匹配的便签',
      noMatchesBody: '换个词试试，或者清除搜索条件。',
      deleteConfirm: '删除这条便签？',
      delete: '删除',
      cancel: '取消',
      pin: '置顶',
      unpin: '取消置顶',
      color: '更换颜色',
      justNow: '刚刚',
      minutesAgo: '{n} 分钟前',
      hoursAgo: '{n} 小时前',
      daysAgo: '{n} 天前',
      colorAmber: '杏黄',
      colorRose: '玫瑰',
      colorMint: '薄荷',
      colorSky: '天蓝',
      colorLilac: '丁香',
      colorSand: '沙色',
      hintKeys: '⌘ / Ctrl + Enter 新建一条',
      hintTags: '正文里写 #标签 就能按标签筛选',
      filterAll: '全部',
      filterLabel: '按标签筛选',
    };

    const en = {
      panel: 'Notes Wall',
      title: 'Notes Wall',
      kicker: 'QUICK CAPTURE',
      lead: 'Write it down the moment it appears — it saves itself when you pause.',
      newNote: 'New note',
      searchLabel: 'Search notes',
      searchPlaceholder: 'Search notes…',
      clearSearch: 'Clear search',
      export: 'Export',
      import: 'Import',
      exported: 'Exported {n} notes',
      imported: 'Imported {n} notes',
      exportEmpty: 'Nothing to export yet',
      exportFailed: 'Export failed: the browser blocked the download',
      importFailed: 'Import failed: not a notes file',
      emptyTitle: 'The wall is empty',
      emptyBody: 'Write the first thought down — it stays on this wall.',
      emptyAction: 'Write the first one',
      placeholder: 'Write something…',
      saved: 'Saved',
      saveFailed: 'Could not save — browser storage is unavailable',
      count: '{n} notes',
      pinnedCount: '{n} pinned',
      noMatches: 'No matching notes',
      noMatchesBody: 'Try another word, or clear the search.',
      deleteConfirm: 'Delete this note?',
      delete: 'Delete',
      cancel: 'Cancel',
      pin: 'Pin',
      unpin: 'Unpin',
      color: 'Change color',
      justNow: 'just now',
      minutesAgo: '{n} min ago',
      hoursAgo: '{n} h ago',
      daysAgo: '{n} d ago',
      colorAmber: 'Amber',
      colorRose: 'Rose',
      colorMint: 'Mint',
      colorSky: 'Sky',
      colorLilac: 'Lilac',
      colorSand: 'Sand',
      hintKeys: '⌘ / Ctrl + Enter for a new note',
      hintTags: 'Write #tags in a note to filter by them',
      filterAll: 'All',
      filterLabel: 'Filter by tag',
    };

    const CSS = String.raw`
/* ============================================================
   Notes Wall — a sidebar panel of paper notes.
   Chrome (page, toolbar, buttons, empty state) is drawn with the
   host's semantic tokens so it follows the active theme; the notes
   themselves are colored paper, which is content rather than chrome.
   ============================================================ */

.nw-page {
  box-sizing: border-box;
  min-height: 100%;
  overflow: auto;
  padding: calc(var(--dsh-frame-top-clearance, 0px) + 28px) 30px 72px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 94%, #8a7250);
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family-text, inherit);
  scrollbar-gutter: stable;
}

.nw-page * { box-sizing: border-box; }

.nw-page :focus-visible {
  outline: 2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);
  outline-offset: 2px;
}

.nw-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
}

/* ---- heading ---- */

.nw-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 20px;
}

.nw-head-copy { min-width: 0; }

.nw-kicker {
  margin: 0 0 8px;
  color: var(--dsw-alias-brand-primary);
  font: 600 10px/1.2 var(--dsw-font-family-code, ui-monospace, monospace);
  letter-spacing: .2em;
  text-transform: uppercase;
}

.nw-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
}

.nw-lead {
  max-width: 46ch;
  margin: 6px 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
}

.nw-head-actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
}

.nw-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 13px;
  border: 0;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  white-space: nowrap;
  cursor: pointer;
  transition: background .15s, color .15s, filter .15s;
}

.nw-btn-primary {
  background: var(--dsw-alias-brand-primary);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .14);
}

.nw-btn-primary:hover { filter: brightness(1.06); }
.nw-btn-primary:active { transform: translateY(.5px); }

.nw-btn-quiet {
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l1);
}

.nw-btn-quiet:hover {
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);
  color: var(--dsw-alias-label-primary);
}

/* ---- toolbar ---- */

.nw-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
}

.nw-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(320px, 46vw);
  height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  transition: box-shadow .15s;
}

.nw-search:focus-within {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 55%, transparent);
}

.nw-search-glyph { display: inline-flex; flex: none; opacity: .72; }

.nw-search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
}

.nw-search-input::placeholder { color: var(--dsw-alias-label-secondary); opacity: .72; }
.nw-search-input::-webkit-search-cancel-button { display: none; }

.nw-search-clear {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.nw-search-clear:hover {
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
  color: var(--dsw-alias-label-primary);
}

.nw-tools-end {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.nw-stats {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.nw-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  white-space: nowrap;
  animation: nw-fade .18s ease-out;
}

.nw-status::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsw-alias-state-success-primary);
}

.nw-status[data-kind="error"] { color: var(--dsw-alias-state-error-primary); }
.nw-status[data-kind="error"]::before { background: var(--dsw-alias-state-error-primary); }

/* ---- the wall ---- */

.nw-wall {
  columns: 248px;
  column-gap: 22px;
}

.nw-note {
  position: relative;
  isolation: isolate;
  break-inside: avoid;
  page-break-inside: avoid;
  margin: 0 0 22px;
  padding: 25px 17px 12px;
  border-radius: 3px;
  background: var(--nw-paper, #f7e7c2);
  color: var(--nw-ink, #4a3810);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .55),
    0 16px 26px -20px rgba(60, 48, 24, .6),
    0 2px 4px -2px rgba(60, 48, 24, .2);
  transform: rotate(var(--nw-tilt, 0deg));
  transition: transform .18s ease, box-shadow .18s ease;
}

/* The pin is the paper's hardware: a small metal dome in the note's own
   colour, so the wall still reads as six separate sheets. */
.nw-pin {
  position: absolute;
  top: -6.5px;
  left: 50%;
  z-index: 2;
  width: 13px;
  height: 13px;
  margin-left: -6.5px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 26%, rgba(255, 251, 240, 1) 0%, rgba(255, 251, 240, 0) 42%),
    linear-gradient(180deg, var(--nw-pin, #edcba0));
  box-shadow:
    0 1px 2px rgba(46, 34, 14, .38),
    inset 0 1px 1px rgba(255, 255, 255, .5),
    inset 0 -1.5px 2px rgba(0, 0, 0, .26);
  pointer-events: none;
}

.nw-note:hover,
.nw-note:focus-within {
  transform: rotate(0deg) translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .55),
    0 22px 32px -20px rgba(60, 48, 24, .62),
    0 3px 6px -3px rgba(60, 48, 24, .24);
}

.nw-note:focus-within {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .55),
    0 22px 32px -20px rgba(60, 48, 24, .62),
    0 0 0 2px var(--dsw-alias-brand-primary);
}

.nw-input {
  display: block;
  width: 100%;
  min-height: 56px;
  padding: 0;
  border: 0;
  outline: 0;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  caret-color: currentColor;
}

.nw-input::placeholder { color: inherit; opacity: .4; }

.nw-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
  margin-top: 10px;
}

.nw-time {
  color: inherit;
  opacity: .5;
  font: 500 10px/1.5 var(--dsw-font-family-code, ui-monospace, monospace);
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.nw-note-actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity .15s;
}

.nw-note:hover .nw-note-actions,
.nw-note:focus-within .nw-note-actions { opacity: 1; }

@media (hover: none) {
  .nw-note-actions { opacity: 1; }
}

.nw-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  opacity: .55;
  cursor: pointer;
  transition: background .12s, opacity .12s, color .12s;
}

.nw-icon:hover { background: rgba(0, 0, 0, .09); opacity: 1; }

.nw-icon[data-on="true"] {
  background: rgba(255, 255, 255, .44);
  color: #a15c00;
  opacity: 1;
}

.nw-danger:hover {
  background: rgba(180, 40, 40, .14);
  color: #9d2b2b;
}

.nw-palette {
  position: absolute;
  right: 0;
  bottom: 30px;
  z-index: 4;
  display: flex;
  gap: 6px;
  padding: 7px;
  border-radius: 12px;
  background: var(--dsw-alias-bg-overlay, #fff);
  box-shadow:
    0 0 0 .5px var(--dsw-alias-border-l1),
    0 12px 28px -12px rgba(20, 16, 8, .55);
  animation: nw-pop .14s ease-out;
}

.nw-swatch {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .14);
  transition: transform .12s, box-shadow .12s;
}

.nw-swatch:hover { transform: scale(1.12); }

.nw-swatch[data-active="true"] {
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, .2),
    0 0 0 2px var(--dsw-alias-bg-overlay, #fff),
    0 0 0 3.5px rgba(0, 0, 0, .3);
}

.nw-confirm {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  animation: nw-fade .14s ease-out;
}

.nw-confirm-text { opacity: .6; white-space: nowrap; }

.nw-confirm-yes,
.nw-confirm-no {
  height: 22px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  font: inherit;
  font-size: 11.5px;
  white-space: nowrap;
  cursor: pointer;
}

.nw-confirm-yes {
  background: var(--dsw-alias-state-error-primary);
  color: #fff;
}

.nw-confirm-no {
  background: rgba(0, 0, 0, .08);
  color: inherit;
}

.nw-confirm-no:hover { background: rgba(0, 0, 0, .14); }

/* ---- empty states ---- */

.nw-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 62px 24px 70px;
  border: 1px dashed color-mix(in srgb, var(--dsw-alias-label-primary) 18%, transparent);
  border-radius: 18px;
  text-align: center;
}

.nw-empty-glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 6px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 11%, transparent);
  color: var(--dsw-alias-brand-primary);
}

.nw-empty-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
}

.nw-empty-body {
  max-width: 42ch;
  margin: 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 21px;
}

.nw-empty-action { margin-top: 12px; }

.nw-hint {
  margin: 26px 0 0;
  color: var(--dsw-alias-label-secondary);
  font-size: 11.5px;
  text-align: center;
  opacity: .6;
}

.nw-file {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
  white-space: nowrap;
}

/* ---- tags ---- */

.nw-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 0 0 18px;
}

.nw-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 11px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: color .15s, box-shadow .15s, background .15s;
}

.nw-chip:hover { color: var(--dsw-alias-label-primary); }

.nw-chip[data-active="true"] {
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 88%, transparent);
  box-shadow: none;
  color: var(--dsw-alias-bg-base);
}

.nw-chip-count { font-variant-numeric: tabular-nums; opacity: .55; }
.nw-chip[data-active="true"] .nw-chip-count { opacity: .7; }

.nw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 11px 0 2px;
}

.nw-tag {
  padding: 2px 7px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--nw-ink, #4a3810) 8%, transparent);
  color: inherit;
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  opacity: .82;
  cursor: pointer;
}

.nw-tag:hover {
  opacity: 1;
  background: color-mix(in srgb, var(--nw-ink, #4a3810) 15%, transparent);
}

@keyframes nw-fade {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: none; }
}

@keyframes nw-pop {
  from { opacity: 0; transform: scale(.96); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 860px) {
  .nw-head { flex-direction: column; }
  .nw-head-actions { width: 100%; }
}

@media (max-width: 560px) {
  .nw-page { padding-left: 16px; padding-right: 16px; }
  .nw-tools { flex-wrap: wrap; }
  .nw-search { width: 100%; }
  .nw-tools-end { width: 100%; margin-left: 0; justify-content: space-between; }
}

@media (prefers-reduced-motion: reduce) {
  .nw-note { transition: none; }
  .nw-note:hover,
  .nw-note:focus-within { transform: none; }
  .nw-status,
  .nw-palette,
  .nw-confirm { animation: none; }
}
`;

    /* ---------- helpers ---------- */

    function makeId() {
      return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function colorOf(id) {
      for (const color of COLORS) if (color.id === id) return color;
      return COLORS[0];
    }

    function capitalize(id) {
      return id.charAt(0).toUpperCase() + id.slice(1);
    }

    /** A stable, tiny tilt per note so the wall reads as pinned paper. */
    function tiltOf(id) {
      let hash = 0;
      for (let index = 0; index < id.length; index += 1) {
        hash = (hash * 31 + id.charCodeAt(index)) % 100003;
      }
      return ((hash % 21) - 10) / 14;
    }

    /* ---------- tags ---------- */

    const TAG_LIMIT = 8;
    /* `#` + letters/digits/`_`/`-`, opened at a word boundary (no lookbehind, so
       the regex stays safe on older Chromium builds). Group 2 is the label. */
    const TAG_PATTERN = /(^|[^\p{L}\p{N}_])#([\p{L}\p{N}_-]{1,24})/gu;

    /**
     * Tags live in the note body, so the text stays the only source of truth:
     * typing `#插件` into a note both writes it and makes it filterable.
     */
    function extractTags(text) {
      if (typeof text !== 'string' || text.indexOf('#') === -1) return [];
      const tags = [];
      const seen = new Set();
      TAG_PATTERN.lastIndex = 0;
      let match = TAG_PATTERN.exec(text);
      while (match !== null && tags.length < TAG_LIMIT) {
        const label = match[2];
        const key = label.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          tags.push(label);
        }
        match = TAG_PATTERN.exec(text);
      }
      return tags;
    }

    function noteHasTag(note, key) {
      return extractTags(note.text).some((tag) => tag.toLowerCase() === key);
    }

    /** `t` may or may not interpolate; fill `{name}` holes either way. */
    function translate(t) {
      return function tx(key, params) {
        let text = t(key);
        if (params) {
          for (const name of Object.keys(params)) {
            text = text.split('{' + name + '}').join(String(params[name]));
          }
        }
        return text;
      };
    }

    function normalizeNote(raw) {
      if (!raw || typeof raw !== 'object') return null;
      const createdAt = Number(raw.createdAt);
      const updatedAt = Number(raw.updatedAt);
      const stamp = Number.isFinite(createdAt) && createdAt > 0 ? createdAt : Date.now();
      return {
        id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : makeId(),
        text: typeof raw.text === 'string' ? raw.text : '',
        color: COLORS.some((color) => color.id === raw.color) ? raw.color : COLORS[0].id,
        pinned: raw.pinned === true,
        createdAt: stamp,
        updatedAt: Number.isFinite(updatedAt) && updatedAt > 0 ? updatedAt : stamp,
      };
    }

    /** @returns {Array|null} notes for a stored value, or null when unreadable. */
    function normalizeList(value) {
      const list = Array.isArray(value)
        ? value
        : value && typeof value === 'object' && Array.isArray(value.notes)
          ? value.notes
          : null;
      if (list === null) return null;
      const notes = [];
      for (const raw of list) {
        const note = normalizeNote(raw);
        if (note) notes.push(note);
        if (notes.length >= MAX_NOTES) break;
      }
      return notes;
    }

    function readNotes() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return normalizeList(JSON.parse(raw)) || [];
      } catch (_error) {
        return [];
      }
    }

    function writeNotes(notes) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes }));
        return true;
      } catch (_error) {
        return false;
      }
    }

    function timeLabel(t, tx, stamp) {
      const elapsed = Date.now() - stamp;
      const minute = 60000;
      const hour = 60 * minute;
      const day = 24 * hour;
      if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed < minute) return t('justNow');
      if (elapsed < hour) return tx('minutesAgo', { n: Math.floor(elapsed / minute) });
      if (elapsed < day) return tx('hoursAgo', { n: Math.floor(elapsed / hour) });
      if (elapsed < 30 * day) return tx('daysAgo', { n: Math.floor(elapsed / day) });
      const date = new Date(stamp);
      const sameYear = date.getFullYear() === new Date().getFullYear();
      return date.toLocaleDateString(undefined, sameYear
        ? { month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' });
    }

    /* ---------- icons ---------- */

    function glyph(size, children) {
      return h('svg', {
        viewBox: '0 0 24 24',
        width: size,
        height: size,
        fill: 'none',
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block' },
      }, ...children);
    }

    const icons = {
      plus(size) {
        return glyph(size, [
          h('path', { key: 'p', d: 'M12 5.6v12.8M5.6 12h12.8', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
        ]);
      },
      search(size) {
        return glyph(size, [
          h('circle', { key: 'c', cx: 10.6, cy: 10.6, r: 5.4, stroke: 'currentColor', strokeWidth: 1.6 }),
          h('path', { key: 'l', d: 'M14.6 14.6 19 19', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        ]);
      },
      close(size) {
        return glyph(size, [
          h('path', { key: 'x', d: 'M6.6 6.6l10.8 10.8M17.4 6.6 6.6 17.4', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        ]);
      },
      pin(size) {
        return glyph(size, [
          h('path', {
            key: 'b',
            d: 'M9.7 3.9h4.6l-.8 4.9 3.2 3.3H7.3l3.2-3.3z',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinejoin: 'round',
          }),
          h('path', { key: 'n', d: 'M12 12.1V20', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
        ]);
      },
      drop(size) {
        return glyph(size, [
          h('path', {
            key: 'd',
            d: 'M12 4.4c3.1 3.6 4.8 5.9 4.8 8a4.8 4.8 0 0 1-9.6 0c0-2.1 1.7-4.4 4.8-8Z',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinejoin: 'round',
          }),
        ]);
      },
      trash(size) {
        return glyph(size, [
          h('path', { key: 'a', d: 'M5.6 7.6h12.8', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
          h('path', { key: 'b', d: 'M9.6 7.4V5.6h4.8v1.8', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }),
          h('path', { key: 'c', d: 'M7.5 7.6l.7 11.1h7.6l.7-11.1', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }),
        ]);
      },
      download(size) {
        return glyph(size, [
          h('path', { key: 'a', d: 'M12 4.6v9.6', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
          h('path', { key: 'b', d: 'M8.3 10.6 12 14.3l3.7-3.7', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
          h('path', { key: 'c', d: 'M5.4 19.4h13.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        ]);
      },
      upload(size) {
        return glyph(size, [
          h('path', { key: 'a', d: 'M12 14.6V5.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
          h('path', { key: 'b', d: 'M8.3 8.9 12 5.2l3.7 3.7', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
          h('path', { key: 'c', d: 'M5.4 19.4h13.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        ]);
      },
      note(size) {
        return glyph(size, [
          h('path', {
            key: 'a',
            d: 'M6 3.9h8.7l4.6 4.7V19a1.1 1.1 0 0 1-1.1 1.1H6A1.1 1.1 0 0 1 4.9 19V5A1.1 1.1 0 0 1 6 3.9Z',
            stroke: 'currentColor',
            strokeWidth: 1.4,
            strokeLinejoin: 'round',
          }),
          h('path', { key: 'b', d: 'M14.4 4.1v4.6h4.8', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }),
          h('path', { key: 'c', d: 'M8.1 12.6h6.2M8.1 16h4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        ]);
      },
    };

    /** Sidebar glyph: outline paper note with a folded corner and two lines. */
    function PanelIcon(props) {
      const size = props.size || 16;
      return icons.note(size);
    }

    /* ---------- a note ---------- */

    const NoteCard = React.memo(function NoteCard(props) {
      const { note, t, tx, confirming, autoFocus } = props;
      const color = colorOf(note.color);
      const tags = extractTags(note.text);
      const [paletteOpen, setPaletteOpen] = React.useState(false);
      const cardRef = React.useRef(null);
      const textRef = React.useRef(null);

      React.useLayoutEffect(() => {
        const element = textRef.current;
        if (!element) return;
        element.style.height = 'auto';
        element.style.height = Math.max(56, element.scrollHeight) + 'px';
      }, [note.text]);

      React.useEffect(() => {
        if (!autoFocus) return;
        const element = textRef.current;
        if (!element) return;
        element.focus();
        const end = element.value.length;
        try {
          element.setSelectionRange(end, end);
        } catch (_error) {
          /* selection APIs are optional in some embeddings */
        }
        props.onFocusDone(note.id);
      }, [autoFocus, note.id]);

      React.useEffect(() => {
        if (!paletteOpen) return undefined;
        const onPointerDown = (event) => {
          if (cardRef.current && !cardRef.current.contains(event.target)) setPaletteOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown, true);
        return () => document.removeEventListener('pointerdown', onPointerDown, true);
      }, [paletteOpen]);

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          if (paletteOpen) {
            event.preventDefault();
            setPaletteOpen(false);
            return;
          }
          event.preventDefault();
          event.currentTarget.blur();
          return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          event.preventDefault();
          props.onCreate();
        }
      };

      const actions = h('div', { className: 'nw-note-actions' },
        paletteOpen && h('div', { className: 'nw-palette', role: 'group', 'aria-label': t('color') },
          COLORS.map((option) => h('button', {
            key: option.id,
            type: 'button',
            className: 'nw-swatch',
            style: { background: option.paper },
            'data-active': note.color === option.id ? 'true' : 'false',
            title: t('color' + capitalize(option.id)),
            'aria-label': t('color' + capitalize(option.id)),
            'aria-pressed': note.color === option.id,
            onClick: () => {
              props.onPatch(note.id, { color: option.id });
              setPaletteOpen(false);
            },
          })),
        ),
        h('button', {
          type: 'button',
          className: 'nw-icon',
          'data-on': note.pinned ? 'true' : 'false',
          title: note.pinned ? t('unpin') : t('pin'),
          'aria-label': note.pinned ? t('unpin') : t('pin'),
          'aria-pressed': note.pinned,
          onClick: () => props.onPatch(note.id, { pinned: !note.pinned }),
        }, icons.pin(14)),
        h('button', {
          type: 'button',
          className: 'nw-icon',
          'data-on': paletteOpen ? 'true' : 'false',
          title: t('color'),
          'aria-label': t('color'),
          'aria-haspopup': 'true',
          'aria-expanded': paletteOpen,
          onClick: () => setPaletteOpen((open) => !open),
        }, icons.drop(14)),
        h('button', {
          type: 'button',
          className: 'nw-icon nw-danger',
          title: t('delete'),
          'aria-label': t('delete'),
          onClick: () => props.onDeleteRequest(note.id),
        }, icons.trash(14)),
      );

      return h('article', {
        ref: cardRef,
        className: 'nw-note',
        'data-note-id': note.id,
        'data-pinned': note.pinned ? 'true' : 'false',
        'data-confirming': confirming ? 'true' : 'false',
        style: {
          '--nw-paper': color.paper,
          '--nw-ink': color.ink,
          '--nw-edge': color.edge,
          '--nw-pin': color.pin,
          '--nw-tilt': tiltOf(note.id) + 'deg',
        },
      },
      h('span', { className: 'nw-pin', 'aria-hidden': 'true' }),
      h('textarea', {
        ref: textRef,
        className: 'nw-input',
        value: note.text,
        rows: 1,
        spellCheck: false,
        placeholder: t('placeholder'),
        'aria-label': t('placeholder'),
        onChange: (event) => props.onText(note.id, event.target.value),
        onBlur: () => props.onBlurNote(note.id),
        onKeyDown,
      }),
      tags.length > 0 && h('div', { className: 'nw-tags' },
        tags.map((tag) => h('button', {
          key: tag,
          type: 'button',
          className: 'nw-tag',
          title: t('filterLabel') + ' · #' + tag,
          onClick: () => props.onTagFilter(tag),
        }, '#' + tag)),
      ),
      h('div', { className: 'nw-meta' },
        h('span', { className: 'nw-time', title: new Date(note.updatedAt).toLocaleString() },
          timeLabel(t, tx, note.updatedAt)),
        confirming
          ? h('div', { className: 'nw-confirm' },
            h('span', { className: 'nw-confirm-text' }, t('deleteConfirm')),
            h('button', {
              type: 'button',
              className: 'nw-confirm-yes',
              onClick: () => props.onDelete(note.id),
            }, t('delete')),
            h('button', {
              type: 'button',
              className: 'nw-confirm-no',
              onClick: () => props.onCancelDelete(),
            }, t('cancel')),
          )
          : actions,
      ),
      );
    });

    /* ---------- the page ---------- */

    function createPage(t) {
      const tx = translate(t);
      const stats = (notes) => {
        const pinned = notes.reduce((count, note) => count + (note.pinned ? 1 : 0), 0);
        return pinned > 0
          ? tx('count', { n: notes.length }) + ' · ' + tx('pinnedCount', { n: pinned })
          : tx('count', { n: notes.length });
      };

      return function NotesWallPage() {
        const [notes, setNotes] = React.useState(readNotes);
        const [query, setQuery] = React.useState('');
        const [confirmId, setConfirmId] = React.useState(null);
        const [focusId, setFocusId] = React.useState(null);
        const [status, setStatus] = React.useState(null);
        const [tick, setTick] = React.useState(0);
        const [tagFilter, setTagFilter] = React.useState(null);
        const notesRef = React.useRef(notes);
        const saveTimer = React.useRef(0);
        const fileRef = React.useRef(null);

        notesRef.current = notes;

        /* Every tag in the wall, most used first; labels keep their typed casing. */
        const tagList = React.useMemo(() => {
          const map = new Map();
          for (const note of notes) {
            for (const tag of extractTags(note.text)) {
              const key = tag.toLowerCase();
              const entry = map.get(key);
              if (entry) entry.count += 1;
              else map.set(key, { key, label: tag, count: 1 });
            }
          }
          return Array.from(map.values())
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
        }, [notes]);

        /* Drop a filter whose last tagged note is gone. */
        React.useEffect(() => {
          if (tagFilter === null) return;
          if (tagList.some((entry) => entry.key === tagFilter)) return;
          setTagFilter(null);
        }, [tagList, tagFilter]);

        const persist = React.useCallback((next) => {
          const ok = writeNotes(next);
          setStatus(ok
            ? { kind: 'saved', text: t('saved'), at: Date.now() }
            : { kind: 'error', text: t('saveFailed') });
          return ok;
        }, []);

        const schedulePersist = React.useCallback((next) => {
          if (saveTimer.current) window.clearTimeout(saveTimer.current);
          saveTimer.current = window.setTimeout(() => {
            saveTimer.current = 0;
            persist(next);
          }, 240);
        }, [persist]);

        /** Apply one state transition to the authoritative in-memory list. */
        const commit = React.useCallback((mutate, options) => {
          const next = mutate(notesRef.current);
          if (!next) return;
          notesRef.current = next;
          setNotes(next);
          if (!options || options.persist !== false) schedulePersist(next);
        }, [schedulePersist]);

        /* Flush a pending debounce when the panel closes or the page unloads. */
        React.useEffect(() => {
          const flush = () => {
            if (!saveTimer.current) return;
            window.clearTimeout(saveTimer.current);
            saveTimer.current = 0;
            writeNotes(notesRef.current);
          };
          window.addEventListener('pagehide', flush);
          window.addEventListener('beforeunload', flush);
          return () => {
            window.removeEventListener('pagehide', flush);
            window.removeEventListener('beforeunload', flush);
            flush();
          };
        }, []);

        React.useEffect(() => {
          if (!status || status.kind === 'error') return undefined;
          const id = window.setTimeout(() => setStatus(null), 1700);
          return () => window.clearTimeout(id);
        }, [status]);

        React.useEffect(() => {
          if (confirmId === null) return undefined;
          const id = window.setTimeout(() => setConfirmId(null), 4500);
          return () => window.clearTimeout(id);
        }, [confirmId]);

        React.useEffect(() => {
          const id = window.setInterval(() => setTick((value) => value + 1), 60000);
          return () => window.clearInterval(id);
        }, []);

        React.useEffect(() => {
          const onStorage = (event) => {
            if (event.key !== STORAGE_KEY) return;
            const next = readNotes();
            notesRef.current = next;
            setNotes(next);
          };
          window.addEventListener('storage', onStorage);
          return () => window.removeEventListener('storage', onStorage);
        }, []);

        const addNote = React.useCallback(() => {
          const now = Date.now();
          const note = {
            id: makeId(),
            text: '',
            color: COLORS[notesRef.current.length % COLORS.length].id,
            pinned: false,
            createdAt: now,
            updatedAt: now,
          };
          commit((current) => [note, ...current]);
          setQuery('');
          setTagFilter(null);
          setConfirmId(null);
          setFocusId(note.id);
        }, [commit]);

        const setText = React.useCallback((id, text) => {
          commit((current) => current.map((note) => (
            note.id === id ? { ...note, text, updatedAt: Date.now() } : note
          )));
        }, [commit]);

        const patchNote = React.useCallback((id, patch) => {
          commit((current) => current.map((note) => (
            note.id === id ? { ...note, ...patch, updatedAt: Date.now() } : note
          )));
        }, [commit]);

        const deleteNote = React.useCallback((id) => {
          commit((current) => current.filter((note) => note.id !== id));
          setConfirmId(null);
        }, [commit]);

        /* An empty note that loses focus was never anything: drop it. */
        const blurNote = React.useCallback((id) => {
          const note = notesRef.current.find((entry) => entry.id === id);
          if (note && note.text.trim() === '') deleteNote(id);
        }, [commit, deleteNote]);

        const onCancelDelete = React.useCallback(() => setConfirmId(null), []);
        const onFocusDone = React.useCallback((id) => {
          setFocusId((current) => (current === id ? null : current));
        }, []);
        const onDeleteRequest = React.useCallback((id) => setConfirmId(id), []);

        const exportNotes = React.useCallback(() => {
          const list = notesRef.current;
          if (list.length === 0) {
            setStatus({ kind: 'error', text: t('exportEmpty') });
            return;
          }
          const payload = JSON.stringify({
            version: 1,
            exportedAt: new Date().toISOString(),
            notes: list,
          }, null, 2);
          let url = '';
          try {
            const blob = new Blob([payload], { type: 'application/json' });
            url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'notes-wall-' + new Date().toISOString().slice(0, 10) + '.json';
            anchor.click();
          } catch (_error) {
            setStatus({ kind: 'error', text: t('exportFailed') });
            if (url) URL.revokeObjectURL(url);
            return;
          }
          if (url) window.setTimeout(() => URL.revokeObjectURL(url), 4000);
          setStatus({ kind: 'saved', text: tx('exported', { n: list.length }) });
        }, []);

        const importNotes = React.useCallback((file) => {
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            let incoming = null;
            try {
              incoming = normalizeList(JSON.parse(String(reader.result || '')));
            } catch (_error) {
              incoming = null;
            }
            if (!incoming) {
              setStatus({ kind: 'error', text: t('importFailed') });
              return;
            }
            const existing = notesRef.current;
            const taken = new Set(existing.map((note) => note.id));
            const fresh = incoming.map((note) => (
              taken.has(note.id) ? { ...note, id: makeId() } : note
            ));
            commit(() => fresh.concat(existing));
            setStatus({ kind: 'saved', text: tx('imported', { n: fresh.length }) });
          };
          reader.onerror = () => setStatus({ kind: 'error', text: t('importFailed') });
          reader.readAsText(file);
        }, [commit]);

        const onFileChange = (event) => {
          const file = event.target.files && event.target.files[0];
          event.target.value = '';
          importNotes(file);
        };

        const filtered = React.useMemo(() => {
          const needle = query.trim().toLowerCase();
          let list = notes;
          if (tagFilter !== null) list = list.filter((note) => noteHasTag(note, tagFilter));
          if (needle !== '') list = list.filter((note) => note.text.toLowerCase().includes(needle));
          const pinned = list.filter((note) => note.pinned);
          const rest = list.filter((note) => !note.pinned);
          return pinned.concat(rest);
        }, [notes, query, tagFilter]);

        const emptyWall = h('div', { className: 'nw-empty' },
          h('div', { className: 'nw-empty-glyph' }, icons.note(24)),
          h('p', { className: 'nw-empty-title' }, t('emptyTitle')),
          h('p', { className: 'nw-empty-body' }, t('emptyBody')),
          h('button', {
            type: 'button',
            className: 'nw-btn nw-btn-primary nw-empty-action',
            onClick: addNote,
          }, icons.plus(15), h('span', null, t('emptyAction'))),
        );

        const noMatches = h('div', { className: 'nw-empty' },
          h('div', { className: 'nw-empty-glyph' }, icons.search(22)),
          h('p', { className: 'nw-empty-title' }, t('noMatches')),
          h('p', { className: 'nw-empty-body' }, t('noMatchesBody')),
          h('button', {
            type: 'button',
            className: 'nw-btn nw-btn-quiet nw-empty-action',
            onClick: () => {
              setQuery('');
              setTagFilter(null);
            },
          }, t('clearSearch')),
        );

        return h('div', { className: 'nw-page', 'data-notes-wall': '' },
          h('div', { className: 'nw-shell' },
            h('header', { className: 'nw-head' },
              h('div', { className: 'nw-head-copy' },
                h('p', { className: 'nw-kicker' }, t('kicker')),
                h('h1', { className: 'nw-title' }, t('title')),
                h('p', { className: 'nw-lead' }, t('lead')),
              ),
              h('div', { className: 'nw-head-actions' },
                h('button', {
                  type: 'button',
                  className: 'nw-btn nw-btn-quiet',
                  title: t('export'),
                  onClick: exportNotes,
                }, icons.download(14), h('span', null, t('export'))),
                h('button', {
                  type: 'button',
                  className: 'nw-btn nw-btn-quiet',
                  title: t('import'),
                  onClick: () => fileRef.current && fileRef.current.click(),
                }, icons.upload(14), h('span', null, t('import'))),
                h('button', {
                  type: 'button',
                  className: 'nw-btn nw-btn-primary',
                  title: t('newNote'),
                  onClick: addNote,
                }, icons.plus(15), h('span', null, t('newNote'))),
              ),
            ),
            h('div', { className: 'nw-tools' },
              h('div', { className: 'nw-search' },
                h('span', { className: 'nw-search-glyph' }, icons.search(15)),
                h('input', {
                  type: 'search',
                  className: 'nw-search-input',
                  value: query,
                  placeholder: t('searchPlaceholder'),
                  'aria-label': t('searchLabel'),
                  onChange: (event) => setQuery(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Escape' && query !== '') {
                      event.preventDefault();
                      setQuery('');
                    }
                  },
                }),
                query !== '' && h('button', {
                  type: 'button',
                  className: 'nw-search-clear',
                  title: t('clearSearch'),
                  'aria-label': t('clearSearch'),
                  onClick: () => setQuery(''),
                }, icons.close(13)),
              ),
              h('div', { className: 'nw-tools-end' },
                status && h('span', {
                  className: 'nw-status',
                  'data-kind': status.kind,
                  role: 'status',
                  'aria-live': 'polite',
                }, status.text),
                h('span', { className: 'nw-stats' }, stats(notes)),
              ),
            ),
            tagList.length > 0 && h('div', {
              className: 'nw-filters',
              role: 'group',
              'aria-label': t('filterLabel'),
            },
              h('button', {
                type: 'button',
                className: 'nw-chip',
                'data-active': tagFilter === null ? 'true' : 'false',
                'aria-pressed': tagFilter === null,
                onClick: () => setTagFilter(null),
              }, t('filterAll'), h('span', { className: 'nw-chip-count' }, String(notes.length))),
              tagList.map((entry) => h('button', {
                key: entry.key,
                type: 'button',
                className: 'nw-chip',
                'data-active': tagFilter === entry.key ? 'true' : 'false',
                'aria-pressed': tagFilter === entry.key,
                onClick: () => setTagFilter((current) => (current === entry.key ? null : entry.key)),
              }, '#' + entry.label, h('span', { className: 'nw-chip-count' }, String(entry.count)))),
            ),
            notes.length === 0
              ? emptyWall
              : filtered.length === 0
                ? noMatches
                : h('div', { className: 'nw-wall' },
                  filtered.map((note) => h(NoteCard, {
                    key: note.id,
                    note,
                    t,
                    tx,
                    tick,
                    confirming: confirmId === note.id,
                    autoFocus: focusId === note.id,
                    onFocusDone,
                    onText: setText,
                    onPatch: patchNote,
                    onBlurNote: blurNote,
                    onDeleteRequest,
                    onCancelDelete,
                    onDelete: deleteNote,
                    onCreate: addNote,
                    onTagFilter: setTagFilter,
                  })),
                ),
            h('p', { className: 'nw-hint' }, t('hintKeys') + ' · ' + t('hintTags')),
            h('input', {
              ref: fileRef,
              type: 'file',
              className: 'nw-file',
              accept: 'application/json,.json',
              tabIndex: -1,
              'aria-hidden': true,
              onChange: onFileChange,
            }),
          ),
        );
      };
    }

    /* ---------- plugin ---------- */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'notes-wall: dictionaries');
        const t = ctx.locale.bind(NS);

        ctx.effect(() => {
          const layer = document.createElement('style');
          layer.setAttribute('data-dsh-notes-wall', '');
          layer.textContent = CSS;
          document.head.append(layer);
          return () => layer.remove();
        }, 'notes-wall: styles');

        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, createPage(t)));

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 12,
          locale: NS,
          label: () => t('panel'),
        }, PanelIcon));
      },
    };
  },
});
