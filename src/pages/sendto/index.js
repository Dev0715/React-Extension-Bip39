import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import { chainSymbol } from "../../context/config";
import { useGloabalStateContext } from "../../context/provider";
import SignTx from "../signtx";
import styles from "./index.module.css";
import axios from "axios";

const SendTo = () => {
  const { isBTC } = useGloabalStateContext();
  const [jpyRate, setJpyRate] = useState(0);
  const { _address, _setAddress, _amount, _setAmount } =
    useGloabalStateContext();

  // Get JPY rate
  useEffect(() => {
    try {
      const chain = isBTC ? "bitcoin" : "ethereum";
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${chain}`)
        .then((res) => {
          console.log(res.data.market_data.current_price["jpy"]);
          setJpyRate(res.data.market_data.current_price["jpy"]);
        });
    } catch (err) {
      console.log(err);
    }
  }, [isBTC]);

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
