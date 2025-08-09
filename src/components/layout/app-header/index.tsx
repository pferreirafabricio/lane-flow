import styles from "./app-header.module.css";
export default function AppHeader() {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img
          src="/favicon/favicon.svg"
          alt="LaneFlow Logo"
          width={64}
          height={64}
        />
      </div>
      <h1 className={styles.title}>LaneFlow</h1>
      <p className={styles.description}>
        LaneFlow is an interactive timeline component designed for clarity and
        efficiency. It automatically arranges events into compact horizontal
        lanes, allowing related activities to share space when possible. With
        support for zooming, drag-and-drop date adjustments, and inline editing,
        LaneFlow offers a sleek, user-friendly way to visualize chronological
        data.
      </p>
    </header>
  );
}
