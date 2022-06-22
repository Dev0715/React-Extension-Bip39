import styles from "./reset.module.css";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import { useGloabalStateContext } from "../../context/provider";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
// TODO
// import Login from "../login";
import aes from "crypto-js/aes";
import * as bip39 from "bip39";
import * as wif from "wif";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";
import { isLiveMode } from "../../context/config";
import Home from "../home";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const { setIsStarted, _mnemonic, _userName, _setUserName, _setPassword, setBtcKeys, setEthKeys  } = useGloabalStateContext();

  const isPasswordValid = () => {
    if (_userName === "") {
      setError("User name should be input");
      return false;
    } else if (password.length < 8) {
      setError("Password length should not be less than 8!");
      return false;
    } else if (password !== rePassword) {
      setError("Confirmation should be matched!");
      return false;
    } else return true;
  };

  const onRestore = () => {
    if (isPasswordValid()) {
      const encrypted = aes.encrypt(_mnemonic, password);
      localStorage.setItem("enp", encrypted);
      localStorage.setItem("name", _userName);
      setIsStarted(true);
      _setPassword(password);
      processMnemonic(_mnemonic);
      // goTo(Login);
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

  const changeUserName = (e) => {
    setError("");
    _setUserName(e.target.value);
  };

  const changePassword = (e) => {
    setError("");
    setPassword(e.target.value);
  };

  const changeRePassword = (e) => {
    setError("");
    setRePassword(e.target.value);
  };

  const isUserNameError = () => {
    return error.split(" ")[0] === "User";
  };

  const isPasswordError = () => {
    const firstWord = error.split(" ")[0];
    return firstWord === "Password" || firstWord === "Confirmation";
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="SET UP" />
      <div className={styles.wrapper}>
        <div className={styles.input_text}>Create a password and user name</div>
        <div className={styles.input_description}>User name</div>
        <input
          className={styles.user_input}
          type="text"
          placeholder="User name"
          value={_userName}
          onChange={changeUserName}
          style={isUserNameError() ? { border: "2px solid darkred" } : {}}
        />
        <div className={styles.input_description}>
          Password
          <div className={styles.require_description}>
            ※Create with at least 8 characters
          </div>
        </div>
        <input
          className={styles.user_input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={changePassword}
          style={isPasswordError() ? { border: "2px solid darkred" } : {}}
        />
        <div className={styles.input_description}>Confirm</div>
        <input
          className={styles.user_input}
          type="password"
          placeholder="Confirm"
          value={rePassword}
          onChange={changeRePassword}
          style={isPasswordError() ? { border: "2px solid darkred" } : {}}
        />
        {error !== "" && (
          <div className={styles.input_error}>{error}</div>
        )}
        <div className={styles.create_btn}>
          <Btn
            left=""
            right="/icons/icon_arrow.svg"
            title="CREATE"
            onClick={onRestore}
          />
        </div>
        {/* <div className={styles.import}>
          Import with recovery phrase
          <img
            className={styles.small_right}
            src="/icons/icon_gray_arrow.svg"
            alt=""
          />
        </div> */}
      </div>
    </div>
  );
};

export default Reset;
