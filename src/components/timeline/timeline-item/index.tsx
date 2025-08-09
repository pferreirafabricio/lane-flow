import styles from "./timeline-item.module.css";

import type { TimelineItemProps } from "./timeline-item.types";
import { daysBetween } from "../../../shared/utils/date";
import { useState } from "react";

export default function TimelineItem({
  item,
  minDate,
  currentZoom,
  isEditing,
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
  }

  return (
    <div
      className={styles.container}
      style={{
        left: offset * currentZoom,
        width: span * currentZoom,
      }}
      title={`${itemName} (${item.start} - ${item.end}). Double click to edit.`}
      tabIndex={0}
      role="button"
      aria-label={`Timeline event: ${itemName}, from ${item.start} to ${item.end}`}
      aria-pressed={isEditing ? "true" : "false"}
      aria-describedby={`timeline-item-desc-${itemId}`}
      onDoubleClick={() => {
        setEditName(itemName);
        handleEdit(itemId);
      }}
    >
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
        <>
          <span style={{ flex: 1 }}>{itemName}</span>
          <span id={`timeline-item-desc-${itemId}`} style={{ display: "none" }}>
            {`Event ${itemName} runs from ${item.start} to ${item.end}.`}
          </span>
        </>
      )}
    </div>
  );
}
