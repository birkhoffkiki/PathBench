// Organ color mapping 
const organColorMap: Record<string, string> = {
  'Breast': '#5470c6',   // Blue
  'Lung': '#91cc75',     // Green
  'Colon': '#fac858',    // Yellow
  'Brain': '#ee6666',    // Red
  'Stomach': '#73c0de',  // Light Blue
};

/**
 * Get the color for a specific organ
 * @param organ - The organ name
 * @returns The hex color code for the organ
 */
export function getOrganColor(organ: string): string {
  return organColorMap[organ] || '#6B7280'; // Default to gray if organ not found
}

/**
 * Get a lighter version of the organ color for backgrounds
 * @param organ - The organ name
 * @param opacity - The opacity level (0-1)
 * @returns The rgba color string
 */
export function getOrganColorWithOpacity(organ: string, opacity: number = 0.1): string {
  const color = getOrganColor(organ);
  // Convert hex to rgb and add opacity
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Check if a color is light or dark to determine text color
 * @param color - The hex color code
 * @returns true if the color is light, false if dark
 */
export function isLightColor(color: string): boolean {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
