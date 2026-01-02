// ✅ SIMPLIFIED: Removed nameHi and nameGu since we only display English names
export interface Guest {
  id: string;
  name: string;
}

/**
 * Converts a dot-separated or underscore-separated name into proper case
 * Examples:
 * - "rajesh.kumar" -> "Rajesh Kumar"
 * - "kim.minho" -> "Kim Minho"
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
 * Gets guest by parsing name from URL
 * Example: "kim.minho" -> Creates guest "Kim Minho"
 * Name is always displayed in English regardless of language setting
 */
export function getGuestById(id: string): Guest | null {
  if (!id || typeof id !== "string") return null;

  const normalizedId = id.toLowerCase().trim();

  // Check if it's a valid name format (letters, dots, underscores only)
  if (!/^[a-z]([a-z._]*[a-z])?$/i.test(normalizedId)) {
    return null;
  }

  const formattedName = formatNameFromId(normalizedId);

  if (!formattedName) return null;

  // ✅ SIMPLIFIED: Only return English name
  return {
    id: normalizedId,
    name: formattedName,
  };
}

/**
 * Validates if an invite ID is valid
 */
export function isValidInviteId(id: string): boolean {
  if (!id || typeof id !== "string") return false;

  const normalizedId = id.toLowerCase().trim();

  // Valid if it's a properly formatted name (letters, dots, underscores only)
  return /^[a-z]([a-z._]*[a-z])?$/i.test(normalizedId);
}
