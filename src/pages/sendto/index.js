import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { chainSymbol } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import SignTx from "../signtx";
import styles from "./index.module.css";

const SendTo = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();
  const { _address, _setAddress, _amount, _setAmount } =
    useGloabalStateContext();
  const jpyRate = isBTC ? btcKeys.jpyRate : ethKeys.jpyRate;

  const onAmountChange = (e) => {
    const value = e.target.value;
    _setAmount(value);
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
          value={_address}
          onChange={(e) => {
            _setAddress(e.target.value);
          }}
        />
      </div>
      <div className={styles.inputForm}>
        <div className={styles.inputWhat}>Amount</div>
        <input
          type="number"
          placeholder={chainSymbol[Number(isBTC)]}
          value={_amount}
          onChange={onAmountChange}
        />
        <div className={`${styles.inputWhat} ${styles.jpyRate}`}>
          {`( = ${(_amount * jpyRate).toFixed(2)} JPY )`}
        </div>
      </div>
      <Btn title="Confirm" onClick={sendAsset} />
    </div>
  );
};

export default SendTo;
