import styles from "./index.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { chainSymbol } from "../../context/config";
import { goTo } from "react-chrome-extension-router";
import SendTo from "../sendto";
import Receive from "../receive";
import ExportPriv from "../exportpriv";
import Activity from "../activity";
import Header from "../../components/header";
import Btn from "../../components/button";

const Home = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();
  const amount = isBTC ? btcKeys.balance : ethKeys.balance;
  const _amount = isBTC ? btcKeys._balance : ethKeys._balance;

  const shortAddress = () => {
    const _address = isBTC ? btcKeys.address : ethKeys.address;
    const len = _address.length;
    return _address.slice(0, isBTC ? 3 : 5) + "..." + _address.slice(len - 4);
  };

  const copyToClipboard = () => {
    const str = isBTC ? btcKeys.address : ethKeys.address;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  };

  const receive = () => {
    goTo(Receive);
  };

  const send = () => {
    // setSwitchAble(false);
    goTo(SendTo);
  };

  const onExportPriv = () => {
    goTo(ExportPriv);
  };

  const onActivity = () => {
    goTo(Activity);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.sub_header}>
        <div className={styles.address} onClick={copyToClipboard}>
          {shortAddress()}
          <img src="/icons/icon_copy.svg" alt="" />
        </div>
        <img
          src={`/icons/icon_circle_${isBTC ? "bitcoin" : "ethereum"}.svg`}
          alt=""
        />
        <div className={styles.amount}>
          {isNaN(amount) ? amount : parseFloat(amount).toFixed(5)}
          <div className={styles.symbol}>{chainSymbol[Number(isBTC)]}</div>
        </div>
        {_amount > 0 && (
          <div className={styles._amount}>
            {`( Unconfirmed balance ${parseFloat(_amount).toFixed(5)} ${
              chainSymbol[Number(isBTC)]
            } )`}
          </div>
        )}
      </div>
      <div className={styles.wrapper}>
        <div className={styles.receive_btn}>
          <Btn
            title="RECEIVE"
            left="/icons/icon_receive.svg"
            fontSize="15px"
            onClick={receive}
          />
        </div>
        <div className={styles.send_btn}>
          <Btn
            title="SEND"
            left="/icons/icon_send.svg"
            fontSize="15px"
            onClick={send}
          />
        </div>
        <div className={styles.activity_btn}>
          <Btn
            title="CHECK ACTIVITY"
            right="/icons/icon_arrow.svg"
            fontSize="14px"
            height="40px"
            color="#E3348C"
            onClick={onActivity}
          />
        </div>
        <div className={styles.export_priv} onClick={onExportPriv}>
          <img src="/icons/icon_key.svg" alt="" />
          Export Private Key
        </div>
      </div>
    </div>
  );
};

export default Home;
