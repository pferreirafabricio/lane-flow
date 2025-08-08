import styles from "./main-container.module.css";

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.container}>{children}</main>;
}
