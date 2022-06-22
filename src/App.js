import styles from "./App.module.css";
import { Router } from "react-chrome-extension-router";
import Login from "./pages/login";
import { useEffect, useState } from "react";
import aes from "crypto-js/aes";
import cryptoJs from "crypto-js";
import * as bip39 from "bip39";
import * as wif from "wif";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";
import { useGloabalStateContext } from "./context/provider";
import { isLiveMode } from "./context/config";
import Home from "./pages/home";

let useFlag = 0;

function App() {
  const { _setPassword, setBtcKeys, setEthKeys } = useGloabalStateContext();
  const ExpiredState = {
    STARTING: 0,
    EXPIRED: 1,
    UNEXPIRED: 2,
  };
  const [expired, setExpired] = useState(ExpiredState.STARTING);

  useEffect(() => {
    useFlag = 1 - useFlag;
    if (!useFlag) return;
    console.log("App", useFlag);

    const enp = localStorage.getItem("enp");
    if (enp !== null) {
      try {
        const exp = localStorage.getItem("exp");
        if (exp !== null) {
          const today = new Date();
          const curTime = today.getTime() / 1000;
          if (curTime < Number(exp) + 5 * 60) {
            const encrypted = localStorage.getItem("enw");
            const _pwd = aes
              .decrypt(encrypted, exp)
              .toString(cryptoJs.enc.Utf8);
            const decrypted = localStorage.getItem("enp");
            const mnemonic = aes
              .decrypt(decrypted, _pwd)
              .toString(cryptoJs.enc.Utf8);
            setExpired(ExpiredState.UNEXPIRED);
            _setPassword(_pwd);
            processMnemonic(mnemonic);
          } else {
            setExpired(ExpiredState.EXPIRED);
          }
        } else {
          setExpired(ExpiredState.EXPIRED);
        }
      } catch (err) {
        setExpired(ExpiredState.EXPIRED);
        console.log(err);
      }
    } else {
      setExpired(ExpiredState.EXPIRED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processMnemonic = async (mnemonic) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = HDKey.parseMasterSeed(seed);
    const btcDerivePath = isLiveMode ? "m/44'/0'/0'/0/0" : "m/44'/1'/0'/0/0";
    const btcNetwork = isLiveMode ? 128 : 239;
    const ethDerivePath = "m/44'/60'/0'/0/0";
    const btcWallet = masterKey.derive(btcDerivePath);
    const ethWallet = masterKey.derive(ethDerivePath);
    const btcKeys = {
      priv: wif.encode(btcNetwork, btcWallet.privateKey, true),
      pub: btcWallet.publicKey.toString("hex"),
      address: BitcoinAddress.from(
        btcWallet.publicKey,
        isLiveMode ? versions.bitcoinMain : versions.bitcoinTest
      ).address,
      balance: "...",
      _balance: 0,
      jpyRate: 0,
    };
    const ethKeys = {
      priv: ethWallet.privateKey.toString("hex"),
      pub: ethWallet.publicKey.toString("hex"),
      address: EthereumAddress.from(ethWallet.publicKey).address,
      balance: "....",
      _balance: 0,
      jpyRate: 0,
    };
    setBtcKeys(btcKeys);
    setEthKeys(ethKeys);

    if (btcKeys.address && ethKeys.address) {
      console.log("assertion for address");
      console.assert(BitcoinAddress.isValid(btcKeys.address));
      console.assert(EthereumAddress.isValid(ethKeys.address));
    }

    setExpired(false);
  };

  if (expired === ExpiredState.STARTING) return;

  return (
    <div className={styles.wrapper}>
      <Router>{expired ? <Login /> : <Home />}</Router>
    </div>
  );
}

export default App;
