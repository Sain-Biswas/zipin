export type SlugOptions = {
  separator?: string; // default '-'
  lowercase?: boolean; // default true
  removeDiacritics?: boolean; // default true
  maxLength?: number | null; // default null (no limit)
  allowedChars?: RegExp | null; // extra allowed characters (keeps them)
};

const DEFAULTS: Required<SlugOptions> = {
  separator: "-",
  lowercase: true,
  removeDiacritics: true,
  maxLength: null,
  allowedChars: null
};

export function slugify(input: string, opts: SlugOptions = {}): string {
  const { separator, lowercase, removeDiacritics, maxLength, allowedChars } = {
    ...DEFAULTS,
    ...opts
  };

  if (!input) return "";

  let s = input;

  // Normalize to NFKD/NFD so diacritics can be removed predictably
  // NFD is usually enough for Latin accents.
  s = s.normalize("NFD");

  if (removeDiacritics) {
    // Remove combining diacritical marks using Unicode property escapes.
    // Requires environment supporting \p{M} or \p{Diacritic} (ES2018+ / Node 10+).
    s = s.replace(/\p{M}/gu, "");
  }

  if (lowercase) s = s.toLowerCase();

  // Allow user to preserve additional characters by building a character class.
  // Base allowed = letters, numbers.
  let allowedClass = "a-z0-9";
  if (allowedChars instanceof RegExp) {
    // If user supplied a RegExp like /[._~]/ include those characters.
    // Extract characters from the source if it's a plain char class.
    // Fallback: ignore allowedChars if complex — simpler to let user post-process.
    const source = allowedChars.source;
    // crude attempt to pull literal chars like "._~" from something like "[._~]"
    const match = /^\[([^\]]+)\]$/.exec(source);
    if (match?.[1]) {
      // escape any regex-special characters inside
      const extra = match[1].replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      allowedClass += extra;
    }
  }

  // Replace any character not in allowedClass with separator.
  const notAllowedRE = new RegExp(`[^${allowedClass}]+`, "gu");
  s = s.replace(notAllowedRE, separator);

  // collapse multiple separators
  const sepEsc = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const multiSepRE = new RegExp(`${sepEsc}{2,}`, "g");
  s = s.replace(multiSepRE, separator);

  // trim separators from ends
  const trimRE = new RegExp(`^${sepEsc}|${sepEsc}$`, "g");
  s = s.replace(trimRE, "");

  if (maxLength && s.length > maxLength) {
    // Truncate sensibly: cut at last separator within maxLength if possible
    const cut = s.slice(0, maxLength);
    const lastSep = cut.lastIndexOf(separator);
    s = lastSep > -1 ? cut.slice(0, lastSep) : cut.slice(0, maxLength);
    s = s.replace(trimRE, "");
  }

  return s;
}
