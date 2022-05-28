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

const Home = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();
  const [amount, setAmount] = useState(0);

  // Get Balance
  useEffect(() => {
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
            const _btc = _balance / Math.pow(10, 8);
            const _eth = _balance / Math.pow(10, 9) / Math.pow(10, 9);
            setAmount(isBTC ? _btc : _eth);
          });
      } catch (err) {
        console.log(err);
      }
    };

    getBalance();
    const timerId = setInterval(getBalance, GetBalanceInterval);
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC]);

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
    </div>
  );
};

export default Home;
