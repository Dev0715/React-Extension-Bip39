import { useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { blockcypherApi, chainSymbol, isLiveMode } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import SignComplete from "./signcomplete";
import axios from "axios";
import { blockcypherApiKey } from "../../context/config";

import ECPairFactory from "ecpair";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { encode } from "bitcoinjs-lib/src/script_signature";

const ECPair = ECPairFactory(ecc);

const SignTx = () => {
  const { isBTC } = useGloabalStateContext();
  const { _address, _amount, btcKeys, ethKeys } = useGloabalStateContext();
  const [gasPrice, setGasPrice] = useState(0);
  const [error, setError] = useState("Calculating Gas Cost");
  const [txData, setTxData] = useState({});

  useState(() => {
    const address = isBTC ? btcKeys.address : ethKeys.address;
    const newTx = {
      inputs: [{ addresses: [address] }],
      outputs: [
        {
          addresses: [_address],
          value: isBTC ? _amount * Math.pow(10, 8) : _amount * Math.pow(10, 18),
        },
      ],
    };
    try {
      axios
        .post(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/txs/new?token=${blockcypherApiKey}`,
          JSON.stringify(newTx)
        )
        .then((res) => {
          const _gas = res.data.tx.fees;
          const _eth = _gas / Math.pow(10, 9) / Math.pow(10, 9);
          const _btc = _gas / Math.pow(10, 8);
          setGasPrice(isBTC ? _btc : _eth);
          setError("");
          setTxData(res.data);
        })
        .catch((errResponse) => {
          console.log(errResponse);
          const err = errResponse?.response?.data;
          if (err?.error) {
            setError(err.error);
          } else {
            const _gas = err.tx.fees;
            const _eth = _gas / Math.pow(10, 9) / Math.pow(10, 9);
            const _btc = _gas / Math.pow(10, 8);
            setGasPrice(isBTC ? _btc : _eth);
            setError(err.errors[0].error);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const signTx = () => {
    let tmpTx = txData;
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
    console.log(tmpTx);

    axios
      .post(
        `${
          blockcypherApi[Number(isLiveMode)][Number(isBTC)]
        }/txs/send?token=${blockcypherApiKey}`,
        tmpTx
      )
      .then((res) => {
        console.log(res);
      });
    goTo(SignComplete);
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
