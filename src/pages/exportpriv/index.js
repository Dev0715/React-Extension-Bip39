import { useState } from "react";
import Btn from "../../components/button";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import aes from "crypto-js/aes";
import cryptoJs from "crypto-js";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";

const ExportPriv = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [isShown, setShown] = useState(false);

  const onConfirm = () => {
    const decrypted = localStorage.getItem("enp");
    try {
      const mnemonic = aes
        .decrypt(decrypted, password)
        .toString(cryptoJs.enc.Utf8);
      if (mnemonic.split(" ").length === 12) {
        setShown(true);
      } else {
        setError(true);
        setPassword("");
      }
    } catch (err) {
      console.log(err);
      setError(true);
      setPassword("");
    }
  };

  const onChangePwd = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  const onClickPriv = () => {
    const str = isBTC ? btcKeys.priv : ethKeys.priv;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="EXPORT PRIVATE KEY" />
      <div className={styles.wrapper}>
        {isShown ? (
          <div className={styles.title}>Your Private Key</div>
        ) : (
          <div className={styles.input_description}>Password</div>
        )}
        {isShown && isBTC && (
          <div className={styles.wif}>Support: WIF(Wallet Import Format)</div>
        )}
        {isShown ? (
          <div className={styles.priv} onClick={onClickPriv}>
            {`${isBTC ? btcKeys.priv : ethKeys.priv}`}
            <img
              className={styles.copy_symbol}
              src="/icons/icon_copy.svg"
              alt=""
            />
          </div>
        ) : (
          <input
            className={styles.password_input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={onChangePwd}
            style={isError ? { borderColor: "darkred" } : {}}
          />
        )}
        {isShown ? (
          <div className={styles.alert}>
            <div className={styles.alert_title}>
              <img src="/icons/icon_warning.svg" alt="" />
              Warning
            </div>
            Never disclose this key. Anyone with your private keys can steal any
            assets held in your account.
          </div>
        ) : (
          <div className={styles.confirm_btn}>
            <Btn
              title="Confirm"
              right="/icons/icon_arrow.svg"
              onClick={onConfirm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPriv;
