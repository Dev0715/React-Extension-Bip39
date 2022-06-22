import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
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
    <div className={styles.container}>
      <Header />
      <SubHeader title="SEND" />
      <div className={styles.wrapper}>
        <div className={styles.input_what}>Send to</div>
        <input
          type="text"
          placeholder="Address"
          value={_address}
          onChange={(e) => {
            _setAddress(e.target.value);
          }}
        />
        <div className={styles.input_what}>Amount</div>
        <div className={styles.amount_input}>
          <input
            type="text"
            placeholder="Amount"
            value={_amount}
            onChange={onAmountChange}
          />
          {chainSymbol[Number(isBTC)]}
        </div>
        <div className={styles.jpy_rate}>
          {`( = ${(_amount * jpyRate).toFixed(2)} JPY )`}
        </div>
        <div className={styles.confirm_btn}>
          <Btn
            title="Confirm"
            right="/icons/icon_arrow.svg"
            onClick={sendAsset}
          />
        </div>
      </div>
    </div>
  );
};

export default SendTo;
