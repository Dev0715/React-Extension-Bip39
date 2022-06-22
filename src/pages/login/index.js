import cryptoJs from "crypto-js";
import aes from "crypto-js/aes";
import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import Creation from "../creation";
import ForgotPassword from "../creation/forgotpassword";
import Home from "../home";
import styles from "./index.module.css";
import * as bip39 from "bip39";
import * as wif from "wif";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";
import { useGloabalStateContext } from "../../context/provider";
import {
  // blockcypherApi,
  // blockcypherApiKey,
  isLiveMode,
} from "../../context/config";
// import axios from "axios";

let useFlag = 0;

const Login = () => {
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const {
    isStarted,
    setIsStarted,
    setBtcKeys,
    setEthKeys,
    _setUserName,
    _setPassword,
  } = useGloabalStateContext();

  useEffect(() => {
    useFlag = 1 - useFlag;
    if (!useFlag) return;
    console.log("Login", useFlag);

    const enp = localStorage.getItem("enp");
    if (enp !== null) {
      setIsStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePassword = (e) => {
    setError(false);
    setPassword(e.target.value);
  };

  const unLock = () => {
    const decrypted = localStorage.getItem("enp");
    try {
      const mnemonic = aes
        .decrypt(decrypted, password)
        .toString(cryptoJs.enc.Utf8);
      if (mnemonic.split(" ").length === 12) {
        _setUserName(localStorage.getItem("name"));
        _setPassword(password);
        processMnemonic(mnemonic);
      } else {
        setPassword("");
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setPassword("");
      setError(true);
    }
  };

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

    goTo(Home);
  };

  const getStarted = () => {
    goTo(Creation);
  };

  const onForgot = () => {
    goTo(ForgotPassword);
  };

  return (
    <div className={styles.container}>
      {isStarted ? (
        <div className={styles.wrapper} style={{ background: "white" }}>
          <img
            className={styles.logo_blue}
            src="/images/logo.blue_vertical.svg"
            alt=""
          />
          <div className={styles.input_text}>Enter your password</div>
          <div className={styles.input_description}>Password</div>
          <input
            className={styles.password_input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={changePassword}
            style={isError ? { borderColor: "darkred" } : {}}
          />
          {isError && (
            <div className={styles.input_error}>Your password is wrong.</div>
          )}
          <div className={styles.login_btn}>
            <Btn
              left=""
              right="/icons/icon_arrow.svg"
              title="LOGIN"
              onClick={unLock}
            />
          </div>
          <div className={styles.forgot} onClick={onForgot}>
            Forgot password
            <img
              className={styles.small_right}
              src="/icons/icon_gray_arrow.svg"
              alt=""
            />
          </div>
        </div>
      ) : (
        <div className={styles.wrapper}>
          <img
            className={styles.logo_white}
            src="/images/logo.white_vertical.svg"
            alt=""
          />
          <div className={styles.bottom_btn}>
            <Btn
              right="/icons/icon_arrow.svg"
              title="GET STARTED"
              color="#49B8FD"
              onClick={getStarted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
