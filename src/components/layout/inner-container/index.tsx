import styles from "./inner-container.module.css";

export default function InnerContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={styles.innerContainer}>{children}</main>;
}
