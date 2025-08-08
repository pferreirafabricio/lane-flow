import { useMemo, useState, useRef } from "react";
import { assignLanes, getTimelineRange } from "./timeline.utils";
import { daysBetween } from "../../shared/utils/date";
import {
  hasSavedTimelineItems,
  loadTimelineItems,
  saveTimelineItems,
} from "../../services/lanes-service";
import type { TimelineItem } from "./timeline.types";

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const [zoom, setZoom] = useState(50);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragType, setDragType] = useState<"start" | "end" | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [localItems, setLocalItems] = useState<TimelineItem[]>(() => {
    if (hasSavedTimelineItems()) return loadTimelineItems();
    return items;
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  const lanes = useMemo(() => assignLanes(localItems), [localItems]);
  const { min, max } = getTimelineRange(localItems);
  const totalDays = daysBetween(min, max) + 1;

  const headerDates: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(min);
    d.setDate(d.getDate() + i);
    headerDates.push(d.toISOString().slice(0, 10));
  }

  function handleDragStart(
    e: React.MouseEvent,
    id: number,
    type: "start" | "end"
  ) {
    setDragId(id);
    setDragType(type);
    setDragOffset(e.clientX);
    document.body.style.cursor = "ew-resize";
  }
  function handleDrag(e: React.MouseEvent) {
    if (dragId && dragType && timelineRef.current && e.buttons === 1) {
      const deltaPx = e.clientX - dragOffset;
      const deltaDays = Math.round(deltaPx / zoom);
      setLocalItems((prev: TimelineItem[]) => {
        const updated = prev.map((item) => {
          if (item.id !== dragId) return item;
          let start = item.start;
          let end = item.end;
          if (dragType === "start") {
            const d = new Date(item.start);
            d.setDate(d.getDate() + deltaDays);
            start = d.toISOString().slice(0, 10);
            if (start > end) start = end;
          } else {
            const d = new Date(item.end);
            d.setDate(d.getDate() + deltaDays);
            end = d.toISOString().slice(0, 10);
            if (end < start) end = start;
          }
          return { ...item, start, end };
        });
        saveTimelineItems(updated);
        return updated;
      });
    }
  }
  function handleDragEnd() {
    setDragId(null);
    setDragType(null);
    setDragOffset(0);
    document.body.style.cursor = "default";
  }

  function handleEdit(id: number, name: string) {
    setEditId(id);
    setEditName(name);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditName(e.target.value);
  }

  function handleEditSave(id: number) {
    setLocalItems((prevItems: TimelineItem[]) => {
      const updated = prevItems.map((item) =>
        item.id === id ? { ...item, name: editName } : item
      );
      saveTimelineItems(updated);
      return updated;
    });
    setEditId(null);
    setEditName("");
  }

  // Keyboard accessibility for zoom
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "+") setZoom((z) => Math.min(z + 10, 120));
    if (e.key === "-") setZoom((z) => Math.max(z - 10, 50));
  }

  return (
    <div
      className="timeline-container"
      ref={timelineRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="timeline-zoom-controls">
        <button
          onClick={() => setZoom((z) => Math.max(z - 10, 50))}
          disabled={zoom <= 50}
        >
          -
        </button>
        <span>Zoom: {zoom}px/day</span>
        <button
          onClick={() => setZoom((z) => Math.min(z + 10, 120))}
          disabled={zoom >= 120}
        >
          +
        </button>
      </div>
      <div className="timeline-header">
        {headerDates.map((date) => (
          <div key={date} className="timeline-date" style={{ minWidth: zoom }}>
            {date}
          </div>
        ))}
      </div>
      {lanes.map((lane, laneIdx) => (
        <div key={laneIdx} className="timeline-lane">
          {lane.map((item) => {
            const itemId = item.id;
            const itemName = item.name;
            const offset = daysBetween(min, item.start);
            const span = daysBetween(item.start, item.end) + 1;
            const isEditing = editId === itemId;
            const isDragging = dragId === itemId;

            return (
              <div
                key={itemId}
                className={`timeline-item${isDragging ? " dragging" : ""}`}
                style={{
                  left: offset * zoom,
                  width: span * zoom,
                }}
                title={`${itemName} (${item.start} - ${item.end})`}
                tabIndex={0}
                onDoubleClick={() => handleEdit(itemId, itemName)}
                onMouseUp={handleDragEnd}
                onMouseMove={handleDrag}
              >
                <span
                  className="drag-handle"
                  onMouseDown={(e) => handleDragStart(e, itemId, "start")}
                >
                  ≡
                </span>
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={handleEditChange}
                    onBlur={() => handleEditSave(itemId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(itemId);
                    }}
                    autoFocus
                  />
                ) : (
                  <span style={{ flex: 1 }}>{itemName}</span>
                )}
                <span
                  className="drag-handle"
                  onMouseDown={(e) => handleDragStart(e, itemId, "end")}
                >
                  ≡
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
