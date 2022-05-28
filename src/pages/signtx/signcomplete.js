import styles from "./signcomplete.module.css";
import { goTo } from "react-chrome-extension-router";
import Status from "./status";

const SignComplete = () => {
  const onClick = () => {
    goTo(Status);
  };

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.title}>Signing Complete</div>
      <div className={styles.status_wrapper}>
        <div className={styles.status_title}>Tx Status</div>
        <div className={styles.status_progress}>Processing...</div>
      </div>
    </div>
  );
};

export default SignComplete;
