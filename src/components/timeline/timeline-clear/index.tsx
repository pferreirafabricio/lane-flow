import { Trash } from "lucide-react";
import styles from "./timeline-clear.module.css";
import type { TimelineClearProps } from "./timeline-clear.types";

export default function TimelineClear({ onClear }: TimelineClearProps) {
  return (
    <div className={styles.container} role="region" aria-label="Clear timeline changes">
      <button
        className={styles.clearButton}
        onClick={onClear}
        aria-label="Clear all timeline changes"
      >
        <Trash aria-hidden="true" />
      </button>
    </div>
  );
}
