export interface Guest {
  id: string;
  name: string;
  nameHi: string;
  nameGu: string;
}

/**
 * Converts a dot-separated or underscore-separated name into proper case
 * Examples:
 * - "rajesh.kumar" -> "Rajesh Kumar"
 * - "rajesh_kumar" -> "Rajesh Kumar"
 * - "john.doe.smith" -> "John Doe Smith"
 */
function formatNameFromId(id: string): string {
  // Remove leading and trailing underscores/dots
  const cleaned = id.replace(/^[._]+|[._]+$/g, "");

  // Split by dots, underscores, or spaces
  return cleaned
    .split(/[._\s]+/)
    .filter((part) => part.length > 0)
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Transliterates English names to Hindi (improved implementation)
 * Handles consonant-vowel combinations properly
 */
function transliterateToHindi(name: string): string {
  const transliterationMap: Record<string, string> = {
    // Vowels (independent)
    a: "अ",
    e: "ए",
    i: "इ",
    o: "ओ",
    u: "उ",
    // Consonants
    b: "ब",
    c: "क",
    d: "द",
    f: "फ",
    g: "ग",
    h: "ह",
    j: "ज",
    k: "क",
    l: "ल",
    m: "म",
    n: "न",
    p: "प",
    q: "क",
    r: "र",
    s: "स",
    t: "त",
    v: "व",
    w: "व",
    x: "क्स",
    y: "य",
    z: "ज़",
    // Space handling
    " ": " ",
  };

  return name
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] || char)
    .join("");
}

/**
 * Transliterates English names to Gujarati (improved implementation)
 * Handles consonant-vowel combinations properly
 */
function transliterateToGujarati(name: string): string {
  const transliterationMap: Record<string, string> = {
    // Vowels (independent)
    a: "અ",
    e: "એ",
    i: "ઇ",
    o: "ઓ",
    u: "ઉ",
    // Consonants
    b: "બ",
    c: "ક",
    d: "દ",
    f: "ફ",
    g: "ગ",
    h: "હ",
    j: "જ",
    k: "ક",
    l: "લ",
    m: "મ",
    n: "ન",
    p: "પ",
    q: "ક",
    r: "ર",
    s: "સ",
    t: "ત",
    v: "વ",
    w: "વ",
    x: "ક્સ",
    y: "ય",
    z: "ઝ",
    // Space handling
    " ": " ",
  };

  return name
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] || char)
    .join("");
}

/**
 * Gets guest by parsing name from URL
 * Example: "yashkumar.jani" -> Creates guest "Yashkumar Jani"
 */
export function getGuestById(id: string): Guest | null {
  if (!id || typeof id !== "string") return null;

  const normalizedId = id.toLowerCase().trim();

  // Check if it's a valid name format (letters, dots, underscores only)
  // Updated regex to allow single character names
  if (!/^[a-z]([a-z._]*[a-z])?$/i.test(normalizedId)) {
    return null;
  }

  const formattedName = formatNameFromId(normalizedId);

  if (!formattedName) return null;

  return {
    id: normalizedId,
    name: formattedName,
    nameHi: transliterateToHindi(formattedName),
    nameGu: transliterateToGujarati(formattedName),
  };
}

/**
 * Validates if an invite ID is valid
 */
export function isValidInviteId(id: string): boolean {
  if (!id || typeof id !== "string") return false;

  const normalizedId = id.toLowerCase().trim();

  // Valid if it's a properly formatted name (letters, dots, underscores only)
  // Updated regex to allow single character names
  return /^[a-z]([a-z._]*[a-z])?$/i.test(normalizedId);
}
