import styles from "./index.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { chainName, chainSymbol } from "../../context/config";
import { BuyIcon, SendIcon } from "../../context/svgs";
import { goTo } from "react-chrome-extension-router";
import SendTo from "../sendto";
import Receive from "../receive";

const Home = () => {
  const { isBTC, setSwitchAble } = useGloabalStateContext();

  const receive = () => {
    goTo(Receive);
  };

  const send = () => {
    // setSwitchAble(false);
    goTo(SendTo);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{chainName[Number(isBTC)]}</div>
      <div className={styles.amount_wrapper}>
        <div className={styles.amount_number}>5.8797</div>
        <div className={styles.amount_unit}>{chainSymbol[Number(isBTC)]}</div>
      </div>
      <div className={styles.btns_wrapper}>
        <div className={styles.btn_wrapper} onClick={receive}>
          <div className={styles.btn_back}>
            <BuyIcon />
          </div>
          <div className={styles.btn_text}>Receive</div>
        </div>
        <div className={styles.btn_wrapper} onClick={send}>
          <div className={styles.btn_back}>
            <SendIcon />
          </div>
          <div className={styles.btn_text}>Send</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
