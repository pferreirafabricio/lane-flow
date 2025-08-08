import { getDateParts } from "../../../shared/utils/date";
import type { TimelineHeaderProps } from "./timeline-header.types";
import styles from "./timeline-header.module.css";

export default function TimelineHeader({ dates, zoom }: TimelineHeaderProps) {
  return (
    <div className={styles.container}>
      {dates.map((date) => {
        const { year, month, day } = getDateParts(date);

        return zoom > 70 ? (
          <div
            key={date}
            className={styles.dateLabel}
            style={{ minWidth: zoom }}
          >
            {new Date(date).toLocaleDateString()}
          </div>
        ) : (
          <div key={date} className={styles.dateLabel}>
            <div>
              {month}/{day}
            </div>
            <div>{year}</div>
          </div>
        );
      })}
    </div>
  );
}
