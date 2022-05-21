import { useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { chainSymbol } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";
import SignComplete from "./signcomplete";

const SignTx = () => {
  const { isBTC } = useGloabalStateContext();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const onAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const signTx = () => {
    goTo(SignComplete);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Send to</div>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </div>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Amount</div>
        <input
          type="number"
          placeholder={chainSymbol[Number(isBTC)]}
          value={amount}
          onChange={onAmountChange}
        />
      </div>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Gas Cost</div>
        <input
          type="number"
          placeholder={chainSymbol[Number(isBTC)]}
          value="0.00112"
          readOnly
        />
      </div>
      <Btn title="Sign" onClick={signTx} />
    </div>
  );
};

export default SignTx;
