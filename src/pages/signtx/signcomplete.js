import styles from "./signcomplete.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { chainName, chainSymbol } from "../../context/config";
import { BuyIcon, SendIcon } from "../../context/svgs";
import { goTo } from "react-chrome-extension-router";
import SendTo from "../sendto";
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
    