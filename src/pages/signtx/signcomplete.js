import styles from "./signcomplete.module.css";
import { goTo } from "react-chrome-extension-router";
import { useEffect } from "react";
import { useGloabalStateContext } from "../../context/provider";
import {
  blockcypherApi,
  GetTxStateInterval,
  isLiveMode,
} from "../../context/config";
import axios from "axios";
import Home from "../home";
import { toBTC, toETH } from "../../context/utils";

const SignComplete = () => {
  const { _txData, isBTC } = useGloabalStateContext();

  useEffect(() => {
    getTxState();
    const timerId = setInterval(getTxState, GetTxStateInterval);

    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTxState = () => {
    try {
      axios
        .get(
          `${blockcypherApi[Number(isLiveMode)][Number(isBTC)]}/txs/${_txData}`
        )
        .then((res) => {
          console.log(res);
          if (res?.data?.confirmations > 0) {
            broadcastedTx(res.data);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentDate = () => {
    const _date = new Date();
    return _date.toDateString() + " " + _date.toTimeString().split(" ")[0];
  };

  const broadcastedTx = (_data) => {
    const _storage = isBTC ? "btc" : "eth";
    const _saved = localStorage.getItem(_storage);
    const _activity = _saved ? JSON.parse(_saved) : [];
    const amount = isBTC ? toBTC(_data.total) : toETH(_data.total);

    localStorage.setItem(
      _storage,
      JSON.stringify([
        {
          type: "SEND",
          amount,
          to: _data.outputs[0].addresses[0],
          date: getCurrentDate(),
        },
        ..._activity,
      ])
    );
    goTo(Home);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Signing Complete</div>
      <div className={styles.status_wrapper}>
        <div className={styles.status_title}>Tx Status</div>
        <div className={styles.status_progress}>Processing...</div>
      </div>
    </div>
  );
};

export default SignComplete;
