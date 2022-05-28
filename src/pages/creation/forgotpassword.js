import styles from "./forgotpassword.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import Reset from "./reset";

const ForgotPassword = () => {
  const [mnemonic, setMnemonic] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const { _setMnemonic } = useGloabalStateContext();

  const onNext = () => {
    if (isMnemonicValid()) {
      _setMnemonic(mnemonic.join(" "));
      goTo(Reset);
    } else {
      setMnemonic(["", "", "", "", "", "", "", "", "", "", "", ""]);
    }
  };

  const isMnemonicValid = () => {
    for (let i = 0; i < 12; i++) {
      if (mnemonic[i] === "") return false;
    }
    return true;
  };

  const changeNemonic = (e, index) => {
    let _mnemoic = [...mnemonic];
    _mnemoic[index] = e.target.value;
    setMnemonic([..._mnemoic]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Reset Wallet</div>
      <div className={styles.secretForm}>
        {mnemonic.map((word, index) => (
          <div className={styles.inputWrapper} key={index}>
            <div className={styles.inputNumber}>
              {index < 9 && <div className={styles.whiteSpace}>0</div>}
              {index + 1}
            </div>
            <input value={word} onChange={(e) => changeNemonic(e, index)} />
          </div>
        ))}
      </div>
      <div className={styles.btns_wrapper}>
        <Btn title="Next" onClick={onNext} />
      </div>
    </div>
  );
};

export default ForgotPassword;
