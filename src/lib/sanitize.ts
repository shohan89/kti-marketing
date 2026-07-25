import { FilterXSS } from 'xss'

/**
 * Sanitizer for admin-authored rich text before it reaches
 * dangerouslySetInnerHTML.
 *
 * `xss` is used rather than DOMPurify because this renders on Cloudflare
 * Workers, where there is no DOM and jsdom is unavailable. It is a pure-JS
 * allowlist filter and runs in any runtime.
 *
 * The allowlist matches what the TipTap editor can produce.
 */
const filter = new FilterXSS({
  whiteList: {
    p: [], br: [], hr: [], div: ['class'], span: ['class'],
    h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
    strong: [], b: [], em: [], i: [], u: [], s: [], strike: [], del: [], mark: [],
    ul: [], ol: ['start'], li: [],
    blockquote: [], pre: [], code: ['class'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    figure: [], figcaption: [],
    table: [], thead: [], tbody: [], tr: [], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'],
    sub: [], sup: [],
  },
  // Drop the contents of dangerous tags entirely rather than escaping them
  // into visible text.
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  css: false,
  onTagAttr(tag, name, value) {
    if (name === 'href' || name === 'src') {
      const url = value.trim().toLowerCase()
      // Block javascript:, data:, vbscript: and similar script-bearing schemes.
      // Relative URLs and anchors have no scheme and are allowed through.
      const hasScheme = /^[a-z][a-z0-9+.-]*:/.test(url)
      const allowed =
        url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')
      if (hasScheme && !allowed) return ''
    }
    return undefined // fall through to default handling
  },
})

/** Sanitize an untrusted HTML fragment for rendering. */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''
  const clean = filter.process(html)
  // Force target="_blank" links to carry rel="noopener noreferrer".
  return clean.replace(
    /<a\s+[^>]*?target="_blank"[^>]*?>/gi,
    match => (/\srel=/i.test(match) ? match : match.replace(/>$/, ' rel="noopener noreferrer">')),
  )
}

/**
 * Escape a JSON string for embedding inside a <script> element. Without this,
 * a `</script>` sequence inside any field would terminate the tag early and
 * allow markup injection.
 */
// Built from char codes so the source file contains no literal separator
// characters (which would themselves terminate a regex literal here).
const LINE_SEP = String.fromCharCode(0x2028)
const PARA_SEP = String.fromCharCode(0x2029)
const BACKSLASH = String.fromCharCode(92)

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    // U+2028/U+2029 are valid in JSON but terminate JS string literals.
    .split(LINE_SEP).join(BACKSLASH + 'u2028')
    .split(PARA_SEP).join(BACKSLASH + 'u2029')
}
