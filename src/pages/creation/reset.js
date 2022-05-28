import styles from "./reset.module.css";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import Login from "../login";
import aes from "crypto-js/aes";
import { useGloabalStateContext } from "../../context/provider";

const Reset = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const { _mnemonic } = useGloabalStateContext();

  const isPasswordValid = () => {
    if (password === "") {
      setError("Password should not be empty!");
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
      goTo(Login);
    }
  };

  const changePassword = (e) => {
    setError("");
    setPassword(e.target.value);
  };

  const changeRePassword = (e) => {
    setError("");
    setRePassword(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Restore Wallet</div>
      <div className={styles.inputForm}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={changePassword}
        />
        <input
          type="password"
          placeholder="Confirm"
          value={rePassword}
          onChange={changeRePassword}
        />
        <div className={styles.errorMessage}>{error}</div>
      </div>
      <div className={styles.btns_wrapper}>
        <Btn title="Restore" onClick={onRestore} />
      </div>
    </div>
  );
};

export default Reset;
