/**
 * Host half of the notes-wall bundle.
 *
 * The notes live in the browser (localStorage) and every pixel is drawn by
 * `client.js`, so this half contributes no Host service, no tool, and no
 * route. The empty `apply` exists so the package appears as one Loader row
 * and its Client half is discovered from `package.json` → `dsh.client`.
 */
export function apply() {}
