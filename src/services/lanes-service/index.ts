import type { TimelineItem } from "../../modules/timeline/timeline.types";

export const TIME_LINE_ITEMS_KEY = "_timeline-items";

export function saveTimelineItems(items: TimelineItem[]) {
  localStorage.setItem(TIME_LINE_ITEMS_KEY, JSON.stringify(items));
}

export function loadTimelineItems(): TimelineItem[] {
  const saved = localStorage.getItem(TIME_LINE_ITEMS_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    console.error("Failed to parse timeline items from localStorage");
    return [];
  }
}

export function hasSavedTimelineItems(): boolean {
  return localStorage.getItem(TIME_LINE_ITEMS_KEY) !== null;
}
