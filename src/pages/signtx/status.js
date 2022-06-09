import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  blockcypherApi,
  blockcypherApiKey,
  // blockcypherSocket,
  GetTxStateInterval,
  isLiveMode,
} from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import { CheckIcon, CheckIconGray, LoadingGif } from "../../context/svgs";
import styles from "./status.module.css";
// import useWebSocket from "react-use-websocket";
import ECPairFactory from "ecpair";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { encode } from "bitcoinjs-lib/src/script_signature";
import { goTo } from "react-chrome-extension-router";
import Home from "../home";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const ECPair = ECPairFactory(ecc);

const WAITING = 1;
const RUNNING = 2;
const CHECKED = 3;

let useFlag = 0;

const Status = () => {
  const [steps, setSteps] = useState([
    {
      title: "Signing Complete",
      status: CHECKED,
    },
    {
      title: "Tx is approved",
      status: CHECKED,
    },
    {
      title: "Broadcast Tx",
      status: RUNNING,
    },
    {
      title: "Tx gets confirmed",
      status: WAITING,
    },
  ]);
  const { _txData, _txHash, _setTxHash, isBTC, btcKeys, ethKeys } =
    useGloabalStateContext();
  // const { lastMessage } = useWebSocket(
  //   `${
  //     blockcypherSocket[Number(isLiveMode)][Number(isBTC)]
  //   }?token=${blockcypherApiKey}`
  // );

  useEffect(() => {
    useFlag = 1 - useFlag;
    if (!useFlag) return;
    console.log("Broadcast", useFlag);

    const broadcastTx = async () => {
      try {
        let tmpTx = _txData.txdata;
        tmpTx.pubkeys = [];

        let keys = null;
        if (isBTC) {
          const btcNetwork = isLiveMode
            ? bitcoin.networks.bitcoin
            : bitcoin.networks.testnet;
          const wif = ECPair.fromPrivateKey(new Buffer(btcKeys.priv, "hex"), {
            network: btcNetwork,
          }).toWIF();
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
            console.log(_res);
            if (_res?.data?.tx?.hash) {
              const _steps = steps;
              _steps[2].status = CHECKED;
              _steps[3].status = RUNNING;
              setSteps([..._steps]);
              _setTxHash(_res.data.tx.hash);
              console.log(_res.data.tx.hash);
            } else {
              console.log("Broadcasting Tx Failed");
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    broadcastTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (_txHash === "") return;
    console.log("Confirmed", _txHash);
    const timerId = setInterval(getTxState, GetTxStateInterval);
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_txHash]);

  const getTxState = useCallback(() => {
    if (_txHash === "") return;
    try {
      axios
        .get(
          `${blockcypherApi[Number(isLiveMode)][Number(isBTC)]}/txs/${_txHash}`
        )
        .then((res) => {
          console.log(res);
          if (res?.data?.confirmations > 0) {
            console.log("Tx Confirmed");
            const _steps = steps;
            _steps[3].status = CHECKED;
            setSteps([..._steps]);
            _setTxHash("");
            removeDoc().then((res) => {
              goTo(Home);
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_txHash]);

  // useEffect(() => {
  //   console.log(lastMessage);
  //   if (lastMessage && lastMessage.event === "confirmed-tx") {
  //     if (lastMessage.hash === txHash) {
  //       const _steps = steps;
  //       _steps[3].status = CHECKED;
  //       setSteps([..._steps]);
  //       removeDoc().then((res) => {
  //         goTo(Home);
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lastMessage]);

  const removeDoc = async () => {
    await deleteDoc(doc(db, "transaction", _txData.docId));
    console.log("Document with ID was deleted: ", _txData.docId);
  };

  return (
    <div className={styles.wrapper}>
      {steps.map((step, index) => (
        <div className={styles.stepContainer} key={step.title}>
          <div className={styles.step_wrapper}>
            <div className={styles.status_symbol}>
              {step.status === CHECKED ? (
                <CheckIcon />
              ) : step.status === RUNNING ? (
                <LoadingGif />
              ) : (
                <CheckIconGray />
              )}
            </div>
            <div
              className={styles.step_title}
              style={{
                color:
                  step.status === CHECKED
                    ? "#34b171"
                    : step.status === RUNNING
                    ? "black"
                    : "gray",
              }}
            >
              {step.title}
            </div>
          </div>
          {index < 3 && (
            <div
              className={styles.step_line}
              style={{
                marginBottom:
                  steps[index + 1].status === RUNNING ? "4px" : "0px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Status;
