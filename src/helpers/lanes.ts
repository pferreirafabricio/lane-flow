/**
 * Takes an array of items and assigns them to lanes based on start/end dates.
 * @returns an array of arrays containing items.
 */
type LaneItem = {
  start: string | Date;
  end: string | Date;
  [key: string]: string | number | Date | boolean | undefined;
};

export function assignLanes(items: LaneItem[]): LaneItem[][] {
  const sortedItems = items
    .slice()
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const lanes: LaneItem[][] = [];

  function assignItemToLane(item: LaneItem) {
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
