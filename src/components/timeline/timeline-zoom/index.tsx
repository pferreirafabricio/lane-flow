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
        Zoom: {Math.round(((currentZoom - 70) / (140 - 70)) * 100)}%
      </span>
      <button
        className={styles.magnifyButton}
        onClick={onZoomOut}
        disabled={currentZoom <= 70}
        aria-label="Zoom out"
        aria-disabled={currentZoom <= 70 ? "true" : "false"}
      >
        <ZoomOut aria-hidden="true" />
      </button>
      <button
        className={styles.magnifyButton}
        onClick={onZoomIn}
        disabled={currentZoom >= 140}
        aria-label="Zoom in"
        aria-disabled={currentZoom >= 140 ? "true" : "false"}
      >
        <ZoomIn aria-hidden="true" />
      </button>
    </div>
  );
}
