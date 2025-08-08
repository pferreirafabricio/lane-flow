import styles from "./timeline-item.module.css";

import type { TimelineItemProps } from "./timeline-item.types";
import { daysBetween } from "../../../shared/utils/date";
import { GripVertical } from "lucide-react";
import { useState } from "react";

export default function TimelineItem({
  item,
  minDate,
  currentZoom,
  isEditing,
  isDragging,
  handleEdit,
  handleEditSave,
}: TimelineItemProps) {
  const [editName, setEditName] = useState("");

  const itemId = item.id;
  const itemName = item.name;
  const offset = daysBetween(minDate, item.start);
  const span = daysBetween(item.start, item.end) + 1;

  function handleEditLocal(e: React.ChangeEvent<HTMLInputElement>) {
    setEditName(e.target.value);
    handleEdit(itemId);
  }

  function handleEditSaveLocal(id: number) {
    handleEditSave(id, editName);
    setEditName("");
  }

  return (
    <div
      className={styles.container}
      data-dragging={isDragging}
      style={{
        left: offset * currentZoom,
        width: span * currentZoom,
      }}
      title={`${itemName} (${item.start} - ${item.end})`}
      tabIndex={0}
      onDoubleClick={() => handleEdit(itemId)}
    >
      {/* <span
        className={styles.dragHandle}
        onMouseDown={(e) => handleDragStart(e, itemId, "start")}
      >
        <GripVertical />
      </span> */}
      {isEditing ? (
        <input
          value={editName}
          onChange={handleEditLocal}
          onBlur={() => handleEditSaveLocal(itemId)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSaveLocal(itemId);
          }}
          autoFocus
        />
      ) : (
        <span style={{ flex: 1 }}>{itemName}</span>
      )}
      {/* <span
        className={styles.dragHandle}
        onMouseDown={(e) => handleDragStart(e, itemId, "end")}
      >
        <GripVertical />
      </span> */}
    </div>
  );
}
