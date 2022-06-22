import * as bip39 from "bip39";
import styles from "./forgotpassword.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import Reset from "./reset";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";

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
  const [error, setError] = useState("");

  const onNext = () => {
    if (isMnemonicValid()) {
      _setMnemonic(mnemonic.join(" "));
      goTo(Reset);
    }
  };

  const isMnemonicValid = () => {
    for (let i = 0; i < 12; i++) {
      if (mnemonic[i] === "") {
        setError("Fill in all 12 words.");   
        return false;
      };
    }
    const isValid = bip39.validateMnemonic(mnemonic.join(" "));
    if(!isValid) setError("Invalid Mnemonic.");
    return isValid;
  };

  const changeNemonic = (e, index) => {
    let _mnemoic = [...mnemonic];
    _mnemoic[index] = e.target.value;
    setMnemonic([..._mnemoic]);
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="RESTORATION" />
      <div className={styles.wrapper}>
        <div className={styles.title}>Enter your secret recovery phrase</div>
        <div className={styles.secretForm}>
          {mnemonic.map((word, index) => (
            <div className={styles.input_wrapper} key={index}>
              <div className={styles.input_number}>
                {index < 9 && <div className={styles.white_space}>0</div>}
                {index + 1}
              </div>
              <input
                placeholder="wallet"
                value={word}
                onChange={(e) => changeNemonic(e, index)}
                style={error && word === "" ? { borderColor: "darkred" } : {}}
              />
            </div>
          ))}
        </div>
        {(error !== '')
        ?<div className={styles.error}>{error}</div>
        : <></>
        }
        <div className={styles.login_btn}>
          <Btn title="NEXT" right="/icons/icon_arrow.svg" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
