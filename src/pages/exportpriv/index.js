import { useState } from "react";
import Btn from "../../components/button";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import aes from "crypto-js/aes";
import cryptoJs from "crypto-js";

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
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const onChangePwd = (e) => {
    setPassword(e.target.value);
    setError(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputForm}>
        {!isShown && <div className={styles.inputWhat}>Password</div>}
        {isShown ? (
          <div className={styles.priv}>
            {isBTC ? btcKeys.priv : ethKeys.priv}{" "}
          </div>
        ) : (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={onChangePwd}
          />
        )}
      </div>
      <div className={styles.alert}>
        Warning: Never disclose this key. Anyone with your private keys can
        steal any assets held in your account.
      </div>
      <Btn title="Confirm" onClick={onConfirm} />
      {isError && (
        <div className={styles.errorMessage}>{"Password is invalid!"}</div>
      )}
    </div>
  );
};

export default ExportPriv;
