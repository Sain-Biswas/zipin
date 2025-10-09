/**
 * Converts ISO country code to English country names
 *
 */
export function getCountryName(code: string | undefined) {
  if (!code) return "Unknown";

  try {
    const utility = new Intl.DisplayNames("en", { type: "region" });
    return utility.of(code) ?? "Unknown";
  } catch {
    return "Unknown";
  }
}
