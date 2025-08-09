import { ZoomIn, ZoomOut } from "lucide-react";
import styles from "./timeline-zoom.module.css";
import type { TimelineZoomProps } from "./timeline-zoom.types";

export default function TimelineZoom({
  currentZoom,
  onZoomOut,
  onZoomIn,
}: TimelineZoomProps) {
  return (
    <div className={styles.container} role="group" aria-label="Timeline zoom controls">
      <span className={styles.label} aria-live="polite" aria-atomic="true">
        Zoom: {Math.round(((currentZoom - 50) / (120 - 50)) * 100)}%
      </span>
      <button
        className={styles.magnifyButton}
        onClick={onZoomOut}
        disabled={currentZoom <= 50}
        aria-label="Zoom out"
        aria-disabled={currentZoom <= 50 ? "true" : "false"}
      >
        <ZoomOut aria-hidden="true" />
      </button>
      <button
        className={styles.magnifyButton}
        onClick={onZoomIn}
        disabled={currentZoom >= 120}
        aria-label="Zoom in"
        aria-disabled={currentZoom >= 120 ? "true" : "false"}
      >
        <ZoomIn aria-hidden="true" />
      </button>
    </div>
  );
}
