import styles from "./secretphrase.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { goTo } from "react-chrome-extension-router";
import Login from "../login";
import Btn from "../../components/button";

import * as bip39 from "bip39";
import { useEffect, useState } from "react";
import aes from "crypto-js/aes";

const SecretPhrase = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [revealed, setRevealed] = useState(false);
  const { _password } = useGloabalStateContext();

  useEffect(() => {
    setMnemonic(bip39.generateMnemonic());
  }, []);

  const onCreate = () => {
    console.log(mnemonic, _password);
    const encrypted = aes.encrypt(mnemonic, _password);
    localStorage.setItem("enp", encrypted);
    goTo(Login);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Secret Recovery Phrase</div>
      <div className={styles.secretForm} onClick={() => setRevealed(!revealed)}>
        <div className={styles.secret}>
          {revealed ? mnemonic : "Click to reveal!"}
        </div>
      </div>
      <div className={styles.btns_wrapper}>
        <Btn title="Next" onClick={onCreate} />
      </div>
    </div>
  );
};

export default SecretPhrase;
