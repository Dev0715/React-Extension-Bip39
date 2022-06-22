import styles from "./index.module.css";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";

import { useState } from "react";
import SecretPhrase from "./secretphrase";
import { useGloabalStateContext } from "../../context/provider";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import ForgotPassword from "./forgotpassword";

const Creation = () => {
  const { _password, _setPassword, _userName, _setUserName} = useGloabalStateContext();
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const isPasswordValid = () => {
    if (_userName === "") {
      setError("User name should be input");
      return false;
    } else if (_password.length < 8) {
      setError("Password length should not be less than 8!");
      return false;
    } else if (_password !== rePassword) {
      setError("Confirmation should be matched!");
      return false;
    } else return true;
  };

  const onCreate = () => {
    localStorage.setItem("name", _userName);
    if (isPasswordValid()) goTo(SecretPhrase);
  };

  const onRecovery = () => {
    goTo(ForgotPassword);
  };

  const changeUserName = (e) => {
    setError("");
    _setUserName(e.target.value);
  };

  const changePassword = (e) => {
    setError("");
    _setPassword(e.target.value);
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
          value={_password}
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
        {error !== "" && <div className={styles.input_error}>{error}</div>}
        <div className={styles.create_btn}>
          <Btn
            left=""
            right="/icons/icon_arrow.svg"
            title="CREATE"
            onClick={onCreate}
          />
        </div>
        <div className={styles.import} onClick={onRecovery}>
          Import with recovery phrase
          <img
            className={styles.small_right}
            src="/icons/icon_gray_arrow.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Creation;
