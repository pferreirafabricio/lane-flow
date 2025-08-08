import type { TimelineItem } from "./timeline.types";

/**
 * Takes an array of items and assigns them to lanes based on start/end dates.
 * @returns an array of arrays containing items.
 */
export function assignLanes(items: TimelineItem[]): TimelineItem[][] {
  const sortedItems = items
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const lanes: TimelineItem[][] = [];

  function assignItemToLane(item: TimelineItem) {
    for (const lane of lanes) {
      const lastItem = lane[lane.length - 1];
      if (new Date(lastItem.end).getTime() < new Date(item.start).getTime()) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  }

  for (const item of sortedItems) {
    assignItemToLane(item);
  }
  return lanes;
}

export function getTimelineRange(items: TimelineItem[]) {
  const min = items.reduce(
    (acc, item) => (item.start < acc ? item.start : acc),
    items[0].start
  );
  const max = items.reduce(
    (acc, item) => (item.end > acc ? item.end : acc),
    items[0].end
  );
  return { min, max };
}
