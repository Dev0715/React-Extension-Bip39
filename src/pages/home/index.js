import styles from "./index.module.css";
import { useGloabalStateContext } from "../../context/provider";
import {
  blockcypherApi,
  chainName,
  chainSymbol,
  GetBalanceInterval,
  isLiveMode,
} from "../../context/config";
import { BuyIcon, SendIcon } from "../../context/svgs";
import { goTo } from "react-chrome-extension-router";
import SendTo from "../sendto";
import Receive from "../receive";
import { useEffect, useState } from "react";
import axios from "axios";
import ExportPriv from "../exportpriv";
import Activity from "../activity";
import { toBTC, toETH } from "../../context/utils";

const Home = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();
  const [amount, setAmount] = useState(0);

  // Get Balance
  useEffect(() => {
    getBalance();
    const timerId = setInterval(getBalance, GetBalanceInterval);

    return () => {
      console.log("Home Destroyed");
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC]);

  const getBalance = () => {
    try {
      const address = isBTC ? btcKeys.address : ethKeys.address;
      console.log(isBTC, address);
      axios
        .get(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/addrs/${address}/balance`
        )
        .then((res) => {
          console.log(res);
          const _balance = res.data.balance;
          setAmount(isBTC ? toBTC(_balance) : toETH(_balance));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const receive = () => {
    goTo(Receive);
  };

  const send = () => {
    // setSwitchAble(false);
    goTo(SendTo);
  };

  const onExportPriv = () => {
    goTo(ExportPriv);
  };

  const onActivity = () => {
    goTo(Activity);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{chainName[Number(isBTC)]}</div>
      <div className={styles.amount_wrapper}>
        <div className={styles.amount_number}>
          {parseFloat(amount).toFixed(5)}
        </div>
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
      <div className={styles.bottom_wrapper}>
        <div className={styles.forgot} onClick={onExportPriv}>
          Export Private Key
        </div>
        <div className={styles.activity} onClick={onActivity}>
          Activity
        </div>
      </div>
    </div>
  );
};

export default Home;
