import { useState, useEffect } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import {
  blockcypherApi,
  chainSymbol,
  emailJsPublicKey,
  emailJsServiceId,
  emailJsTemplateId,
  isLiveMode,
  txApproveApi,
  txApproverEmail,
  txRejectApi,
} from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import axios from "axios";
import { blockcypherApiKey } from "../../context/config";
import Activity from "../activity";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import emailjs from "@emailjs/browser";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { toBTC, toETH } from "../../context/utils";

const SignTx = () => {
  const { _address, _amount, isBTC, btcKeys, ethKeys } =
    useGloabalStateContext();
  const [gasPrice, setGasPrice] = useState(0);
  const [error, setError] = useState("Calculating Gas Cost");
  const [txData, setTxData] = useState({});

  useEffect(() => {
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
            setTxData(_data);
          }
        })
        .catch((errResponse) => {
          console.log(errResponse);
          const err = errResponse?.response?.data;
          if (err?.error) {
            setError(err.error);
          } else {
            setGasPrice(isBTC ? toBTC(err.tx.fees) : toETH(err.tx.fees));
            setError(err.errors[0].error);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const signTx = async () => {
    setError("Sending Approval Request");

    try {
      const from_address = isBTC ? btcKeys.address : ethKeys.address;
      const docRef = await addDoc(collection(db, "transaction"), {
        address: from_address,
        approved: false,
        rejected: false,
        txdata: txData,
      });
      console.log("Document written with ID: ", docRef.id);

      const _balance = await getBalance();
      const _res = await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          from_address,
          to_address: _address,
          amount: _amount,
          currency: chainSymbol[Number(isBTC)],
          link_approve: `${txApproveApi}?documentId=${docRef.id}`,
          url_reject: `${txRejectApi}?documentId=${docRef.id}`,
          to_mail: txApproverEmail,
          user_name: "User Name",
          balance: _balance,
        },
        emailJsPublicKey
      );
      console.log(_res);
    } catch (err) {
      console.error(err);
    }

    goTo(Activity);
  };

  const getBalance = async () => {
    try {
      const address = isBTC ? btcKeys.address : ethKeys.address;
      const _res = await axios.get(
        `${
          blockcypherApi[Number(isLiveMode)][Number(isBTC)]
        }/addrs/${address}/balance`
      );
      return isBTC ? toBTC(_res.data.balance) : toETH(_res.data.balance);
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Send to</div>
        <input type="text" placeholder="Address" value={_address} readOnly />
      </div>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Amount</div>
        <input
          type="text"
          placeholder={chainSymbol[Number(isBTC)]}
          value={`${_amount} ${chainSymbol[Number(isBTC)]}`}
          readOnly
        />
      </div>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Gas Cost</div>
        <input
          type="text"
          placeholder={chainSymbol[Number(isBTC)]}
          value={`${gasPrice} ${chainSymbol[Number(isBTC)]}`}
          readOnly
        />
      </div>
      {error === "" ? (
        <Btn title="Send" onClick={signTx} />
      ) : (
        <div className={styles.errorMessage}>{`${error.split(",")[0]}!`} </div>
      )}
    </div>
  );
};

export default SignTx;
