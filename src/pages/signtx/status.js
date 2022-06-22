import axios from "axios";
import { useState } from "react";
import {
  blockcypherApi,
  blockcypherApiKey,
  isLiveMode,
} from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./status.module.css";
// import useWebSocket from "react-use-websocket";
import ECPairFactory from "ecpair";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { encode } from "bitcoinjs-lib/src/script_signature";
import { goTo } from "react-chrome-extension-router";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Home from "../home";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import SendHeader from "../../components/sendheader";
import { toBTC, toETH } from "../../context/utils";
import Btn from "../../components/button";

const ECPair = ECPairFactory(ecc);

const Status = () => {
  const { _txDataToSend, _step, _setStep, _setTxHash, isBTC, btcKeys, ethKeys } =
    useGloabalStateContext();
  const [error, setError] = useState(false);

  const _address =
    (!isBTC ? "0x" : "") + _txDataToSend.txdata.tx.outputs[0].addresses[0];
  const _amount = isBTC
    ? toBTC(_txDataToSend.txdata.tx.outputs[0].value)
    : toETH(_txDataToSend.txdata.tx.outputs[0].value);

  const onSendTx = () => {
    _setStep(2);
    broadcastTx();
  };

  const updateDbTx = async (_address, finalTxHash) => {
    const q = query(
      collection(db, "transaction"),
      where("address", "==", _address)
    );
    const qSnapShot = await getDocs(q);
    await qSnapShot?.forEach((doc) => {
      updateDoc(doc.ref, {
        broadcasted: true,
        finalTxHash,
      });
  });
  }

  const broadcastTx = async () => {
    try {
      let tmpTx = _txDataToSend.txdata;
      tmpTx.pubkeys = [];

      let keys = null;
      if (isBTC) {
        const btcNetwork = isLiveMode
          ? bitcoin.networks.bitcoin
          : bitcoin.networks.testnet;
        const wif = btcKeys.priv;
        keys = ECPair.fromWIF(wif, btcNetwork);
      } else {
        const wif = ECPair.fromPrivateKey(
          new Buffer(ethKeys.priv, "hex")
        ).toWIF();
        keys = ECPair.fromWIF(wif);
      }

      tmpTx.signatures = tmpTx.tosign.map((tosign, n) => {
        tmpTx.pubkeys.push(keys.publicKey.toString("hex"));
        const signature = keys.sign(new Buffer(tosign, "hex"));
        const encoded = encode(signature, 0x01);
        return encoded.slice(0, encoded.length - 1).toString("hex");
      });

      axios
        .post(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/txs/send?token=${blockcypherApiKey}`,
          tmpTx
        )
        .then((_res) => {
          if (_res?.data?.tx?.hash) {
            setError(false);
            _setStep(3);
            _setTxHash(_res.data.tx.hash);
            console.log("broadcast:", _res.data.tx.hash);
            updateDbTx(_address, _res.data.tx.hash);
          } else {
            console.log("Broadcasting Tx Failed");
          }
        });
    } catch (err) {
      setError(true);
      console.log("err:", err);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="SEND" />
      <SendHeader
        toAddress={_address}
        amount={_amount}
        step={_step}
        error={error}
      />
      <div className={styles.wrapper}>
        {error ? (
          <div className={styles.btn_wrapper}>
            <div className={styles.btn}>
              <Btn
                title="RETRY"
                fontSize="12px"
                height="40px"
                right="/icons/icon_arrow.svg"
                onClick={onSendTx}
              />
            </div>
            <div className={styles.btn}>
              <Btn
                title="BACK TO HOME"
                fontSize="12px"
                height="40px"
                right="/icons/icon_arrow.svg"
                onClick={() => goTo(Home)}
              />
            </div>
          </div>
        ) : _step === 1 ? (
          <Btn
            title="SEND TX"
            right="/icons/icon_arrow.svg"
            fontSize="12px"
            height="40px"
            onClick={onSendTx}
          />
        ) : _step === 4 ? (
          <Btn
            title="BACK TO HOME"
            right="/icons/icon_arrow.svg"
            fontSize="12px"
            height="40px"
            onClick={() => goTo(Home)}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Status;
