import styles from "./index.module.css";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import SecretPhrase from "./secretphrase";
import { useGloabalStateContext } from "../../context/provider";

const Creation = () => {
  const { _password, _setPassword } = useGloabalStateContext();
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const isPasswordValid = () => {
    if (_password === "") {
      setError("Password should not be empty!");
      return false;
    } else if (_password !== rePassword) {
      setError("Confirmation should be matched!");
      return false;
    } else return true;
  };

  const onCreate = () => {
    if (isPasswordValid()) goTo(SecretPhrase);
  };

  const changePassword = (e) => {
    setError("");
    _setPassword(e.target.value);
  };

  const changeRePassword = (e) => {
    setError("");
    setRePassword(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Create Wallet</div>
      <div className={styles.inputForm}>
        <input
          type="password"
          placeholder="Password"
          value={_password}
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
        <Btn title="Create" onClick={onCreate} />
      </div>
    </div>
  );
};

export default Creation;
