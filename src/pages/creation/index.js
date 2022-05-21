import styles from "./index.module.css";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import SecretPhrase from "./secretphrase";

const Creation = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const isPasswordValid = () => {
    if (password === "") return false;
    else if (password !== rePassword) return false;
    else return true;
  };

  const onCreate = () => {
    // if (isPasswordValid())
    goTo(SecretPhrase);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Create Wallet</div>
      <div className={styles.inputForm}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Confirm"
          value={rePassword}
          onChange={(e) => {
            setRePassword(e.target.value);
          }}
        />
      </div>
      <div className={styles.btns_wrapper}>
        <Btn title="Create" onClick={onCreate} />
      </div>
    </div>
  );
};

export default Creation;
