import { useState, useEffect } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { blockcypherApi, chainSymbol, isLiveMode } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import axios from "axios";
import { blockcypherApiKey } from "../../context/config";

import { sha256 } from "bitcoinjs-lib/src/crypto";
import { toBTC, toETH } from "../../context/utils";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import SignComplete from "./signcomplete";

let useFlag = 0;

const SignTx = () => {
  const { _address, _amount, _setTxDataToSend, isBTC, btcKeys, ethKeys } =
    useGloabalStateContext();
  const [gasPrice, setGasPrice] = useState(0);
  const _defaultError = "...Calculating Gas Cost";
  const [error, setError] = useState(_defaultError);
  // const [txData, setTxData] = useState({});

  useEffect(() => {
    useFlag = 1 - useFlag;
    if (!useFlag) return;
    console.log("Sign", useFlag);

    createTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTx = () => {
    const from_address = isBTC ? btcKeys.address : ethKeys.address;
    const to_address = _address;
    const newTxData = {
      inputs: [{ addresses: [from_address] }],
      outputs: [
        {
          addresses: [to_address],
          value: isBTC ? _amount * Math.pow(10, 8) : _amount * Math.pow(10, 18),
        },
      ],
      preference: "low",
    };

    try {
      axios
        .post(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/txs/new?token=${blockcypherApiKey}&includeToSignTx=${true}`,
          JSON.stringify(newTxData)
        )
        .then((res) => {
          const _data = res.data;
          console.log(_data);

          // Validation for BTC
          const _res = isBTC
            ? _data.tosign_tx.map((tosign_tx, index) => {
                const _tosign = sha256(
                  sha256(new Buffer(tosign_tx, "hex"))
                ).toString("hex");
                return _tosign === _data.tosign[index];
              })
            : [true];
          console.log(_res);

          // if validated
          if (_res.includes(false)) {
            setError("Transactioin is invalid!");
          } else {
            setError("");
            setGasPrice(isBTC ? toBTC(_data.tx.fees) : toETH(_data.tx.fees));
            _setTxDataToSend(_data);
          }
        })
        .catch((errResponse) => {
          console.log(errResponse);
          const err = errResponse?.response?.data;
          if (err?.error) {
            setError(err.error);
          } else {
            setGasPrice(isBTC ? toBTC(err.tx?.fees) : toETH(err.tx?.fees));
            setError(err.errors[0].error);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onSendClick = () => {
    goTo(SignComplete);
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="SEND" />
      <div className={styles.wrapper}>
        <div className={styles.label}>Send to</div>
        <div className={styles.label} style={{ marginTop: "2px" }}>
          {_address}
        </div>
        <div className={styles.label}>Amount</div>
        <div className={styles.amount_label}>
          {_amount}
          <div className={styles.symbol}>{chainSymbol[Number(isBTC)]}</div>
        </div>
        <div className={styles.label}>Gas Cost</div>
        <div className={styles.gas_label}>
          {gasPrice}
          <div className={styles.gas_input}>
            HIGH
            <div className={styles.gas_right}>
              0.005
              <img src="/icons/icon_expand.png" alt="" />
            </div>
            <div className={styles.gas_option}>
              <div className={styles.gas_select}>
                MEDIUM <div>0.0005</div>
              </div>
              <div className={styles.gas_select}>
                LOW <div>0.00001</div>
              </div>
            </div>
          </div>
          <div className={styles.symbol}>{chainSymbol[Number(isBTC)]}</div>
        </div>
        <div className={styles.send_btn}>
          {error === _defaultError && (
            <img className={styles.waiting} src="/images/waiting.gif" alt="" />
          )}
          {error === "" ? (
            <Btn
              title="SEND"
              right="/icons/icon_arrow.svg"
              onClick={onSendClick}
            />
          ) : (
            `${error.split(",")[0]}!`
          )}
        </div>
      </div>
    </div>
  );
};

export default SignTx;
