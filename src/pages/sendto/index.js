import { useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { chainSymbol } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import SignTx from "../signtx";
import styles from "./index.module.css";

const SendTo = () => {
  const { isBTC } = useGloabalStateContext();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [jpyAmount, setJpyAmount] = useState(0);

  const jpyRate = 3000;

  const onAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setJpyAmount(value * jpyRate);
  };

  const sendAsset = () => {
    goTo(SignTx);
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
        <div className={`${styles.inputWhat} ${styles.jpyRate}`}>
          {`( = ${jpyAmount.toFixed(2)} JPY )`}
        </div>
      </div>
      <Btn title="Send" onClick={sendAsset} />
    </div>
  );
};

export default SendTo;
