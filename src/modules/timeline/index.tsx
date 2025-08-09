import { useMemo, useState, useRef } from "react";
import { assignLanes, getTimelineRange } from "./timeline.utils";
import { daysBetween } from "../../shared/utils/date";
import {
  clearTimelineItems,
  hasSavedTimelineItems,
  loadTimelineItems,
  saveTimelineItems,
} from "../../services/lanes-service";
import type { TimelineActivity } from "./timeline.types";
import TimelineHeader from "../../components/timeline/timeline-header";
import TimelineZoom from "../../components/timeline/timeline-zoom";
import TimelineItem from "../../components/timeline/timeline-item";
import styles from "./timeline.module.css";
import TimelineClear from "../../components/timeline/timeline-clear";

export default function Timeline({ items }: { items: TimelineActivity[] }) {
  const [zoom, setZoom] = useState(50);
  const [editId, setEditId] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState<TimelineActivity[]>(() => {
    if (hasSavedTimelineItems()) return loadTimelineItems();
    return items;
  });
  const timelineRef = useRef<HTMLDivElement>(null);
  const lanes = useMemo(() => assignLanes(localItems), [localItems]);
  const { min: minDate, max: maxDate } = getTimelineRange(localItems);
  const totalDays = daysBetween(minDate, maxDate) + 1;
  const headerDates = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(minDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  function handleEdit(id: number) {
    setEditId(id);
  }

  function handleEditSave(id: number, newName: string) {
    setLocalItems((prevItems: TimelineActivity[]) => {
      const updated = prevItems.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      );
      saveTimelineItems(updated);
      return updated;
    });
    setEditId(null);
  }

  return (
    <div
      className={styles.container}
      ref={timelineRef}
      tabIndex={0}
      role="region"
      aria-label="Timeline visualization"
      aria-live="polite"
      aria-describedby="timeline-desc"
    >
      <span id="timeline-desc" style={{ display: "none" }}>
        This is a timeline visualization. Use zoom controls to adjust the view.
        Events are organized in lanes for compact display. You can edit, drag,
        or interact with items using keyboard or mouse.
      </span>
      <div className={styles.toolbar}>
        <TimelineZoom
          currentZoom={zoom}
          onZoomOut={() => setZoom((z) => Math.max(z - 10, 50))}
          onZoomIn={() => setZoom((z) => Math.min(z + 10, 120))}
        />
        <TimelineClear
          onClear={() => {
            setLocalItems(items);
            clearTimelineItems();
          }}
        />
      </div>
      <TimelineHeader dates={headerDates} zoom={zoom} />
      {lanes.map((lane, laneIdx) => (
        <div key={laneIdx} className={styles.lane}>
          {lane.map((item) => (
            <TimelineItem
              key={item.id}
              item={item}
              minDate={minDate}
              currentZoom={zoom}
              isEditing={editId === item.id}
              handleEdit={handleEdit}
              handleEditSave={handleEditSave}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
