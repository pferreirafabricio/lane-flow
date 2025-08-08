import styles from "./loading.module.css";

export default function Loading({ children }: { children: React.ReactNode }) {
  return <main className={styles.loading}>{children}</main>;
}
