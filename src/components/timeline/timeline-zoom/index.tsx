import { ZoomIn, ZoomOut } from "lucide-react";
import styles from "./timeline-zoom.module.css";
import type { TimelineZoomProps } from "./timeline-zoom.types";

export default function TimelineZoom({
  currentZoom,
  onZoomOut,
  onZoomIn,
}: TimelineZoomProps) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>
        Zoom: {Math.round(((currentZoom - 50) / (120 - 50)) * 100)}%
      </span>
      <button
        className={styles.magnifyButton}
        onClick={onZoomOut}
        disabled={currentZoom <= 50}
      >
        <ZoomOut />
      </button>
      <button
        className={styles.magnifyButton}
        onClick={onZoomIn}
        disabled={currentZoom >= 120}
      >
        <ZoomIn />
      </button>
    </div>
  );
}
