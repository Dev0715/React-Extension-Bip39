import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import Creation from "../creation";
import ForgotPassword from "../creation/forgotpassword";
import Home from "../home";
import styles from "./index.module.css";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isStarted, setStarted] = useState(false);

  useEffect(() => {
    const enp = localStorage.getItem("enp");
    if (enp !== null) {
      setStarted(true);
    }
  }, []);

  const unLock = () => {
    goTo(Home);
  };

  const getStarted = () => {
    goTo(Creation);
  };

  const onForgot = () => {
    goTo(ForgotPassword);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>WALLET</div>
      {isStarted ? (
        <div className={styles.inputForm}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Btn title="Unlock" onClick={unLock} />
          <div className={styles.forgot} onClick={onForgot}>Forgot password?</div>
        </div>
      ) : (
        <div className={styles.startForm}>
          <Btn title="Get Started" onClick={getStarted} />
        </div>
      )}
    </div>
  );
};

export default Login;
