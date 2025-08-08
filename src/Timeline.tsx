import { useMemo, useState, useRef } from "react";
import { assignLanes } from "./helpers/lanes";

type TimelineItem = {
  id: number;
  start: string;
  end: string;
  name: string;
};

function getTimelineRange(items: TimelineItem[]) {
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

function daysBetween(start: string, end: string) {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

// ...existing code...

export default function Timeline({ items }: { items: TimelineItem[] }) {
  // Zoom state
  const [zoom, setZoom] = useState(40); // px per day
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragType, setDragType] = useState<"start" | "end" | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [localItems, setLocalItems] = useState<TimelineItem[]>(items);
  const lanes = useMemo(() => assignLanes(localItems), [localItems]);
  const { min, max } = getTimelineRange(localItems);
  const totalDays = daysBetween(min, max) + 1;

  // Update localItems if items prop changes
  // Only update if items reference changes
  // This avoids infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  if (items !== localItems && Array.isArray(items)) setLocalItems(items);

  const headerDates: string[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(min);
    d.setDate(d.getDate() + i);
    headerDates.push(d.toISOString().slice(0, 10));
  }

  // Drag helpers
  const timelineRef = useRef<HTMLDivElement>(null);
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
      setLocalItems((prev: TimelineItem[]) =>
        prev.map((item) => {
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
        })
      );
    }
  }
  function handleDragEnd() {
    setDragId(null);
    setDragType(null);
    setDragOffset(0);
    document.body.style.cursor = "default";
  }

  // Inline edit helpers
  function handleEdit(id: number, name: string) {
    setEditId(id);
    setEditName(name);
  }
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditName(e.target.value);
  }
  function handleEditSave(id: number) {
    setLocalItems((items: TimelineItem[]) =>
      items.map((item) => (item.id === id ? { ...item, name: editName } : item))
    );
    setEditId(null);
    setEditName("");
  }

  // Keyboard accessibility for zoom
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "+") setZoom((z) => Math.min(z + 10, 120));
    if (e.key === "-") setZoom((z) => Math.max(z - 10, 20));
  }

  return (
    <div
      style={{ overflowX: "auto", padding: 16 }}
      ref={timelineRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setZoom((z) => Math.max(z - 10, 20))}>-</button>
        <span style={{ margin: "0 8px" }}>Zoom: {zoom}px/day</span>
        <button onClick={() => setZoom((z) => Math.min(z + 10, 120))}>+</button>
      </div>
      <div style={{ display: "flex", fontWeight: "bold", marginBottom: 8 }}>
        {headerDates.map((date) => (
          <div
            key={date}
            style={{
              minWidth: zoom,
              textAlign: "center",
              fontSize: 12,
              borderRight: "1px solid #eee",
            }}
          >
            {date}
          </div>
        ))}
      </div>
      {lanes.map((lane, laneIdx) => (
        <div
          key={laneIdx}
          style={{
            display: "flex",
            position: "relative",
            height: 36,
            marginBottom: 8,
          }}
        >
          {lane.map((item) => {
            // Defensive: ensure id is number and name is string
            const itemId =
              typeof item.id === "number" ? item.id : Number(item.id);
            const itemName =
              typeof item.name === "string"
                ? item.name
                : String(item.name ?? "");
            const offset = daysBetween(String(min), String(item.start));
            const span = daysBetween(String(item.start), String(item.end)) + 1;
            const isEditing = editId === itemId;
            const isDragging = dragId === itemId;
            return (
              <div
                key={String(itemId)}
                style={{
                  position: "absolute",
                  left: offset * zoom,
                  width: span * zoom,
                  height: 32,
                  background: isDragging ? "#bbdefb" : "#e3f2fd",
                  border: "2px solid #1976d2",
                  borderRadius: 4,
                  padding: "4px 8px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  transition: "left 0.1s, width 0.1s",
                  cursor: isDragging ? "ew-resize" : "pointer",
                  outline: isEditing ? "2px solid #1976d2" : "none",
                }}
                title={`${itemName} (${item.start} - ${item.end})`}
                tabIndex={0}
                onDoubleClick={() => handleEdit(itemId, itemName)}
                onMouseUp={handleDragEnd}
                onMouseMove={handleDrag}
              >
                {/* Drag handles */}
                <span
                  style={{ cursor: "ew-resize", marginRight: 4 }}
                  onMouseDown={(e) => handleDragStart(e, itemId, "start")}
                >
                  ||
                </span>
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={handleEditChange}
                    onBlur={() => handleEditSave(itemId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(itemId);
                    }}
                    style={{ fontSize: 14, width: "70%" }}
                    autoFocus
                  />
                ) : (
                  <span style={{ flex: 1 }}>{itemName}</span>
                )}
                <span
                  style={{ cursor: "ew-resize", marginLeft: 4 }}
                  onMouseDown={(e) => handleDragStart(e, itemId, "end")}
                >
                  ||
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
