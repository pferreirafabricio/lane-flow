import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} LaneFlow. All rights reserved.
    </footer>
  );
}
