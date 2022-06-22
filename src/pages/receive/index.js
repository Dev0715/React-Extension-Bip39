import { useMemo } from "react";
import styles from "./index.module.css";
import QRCode from "react-qr-code";
import { useGloabalStateContext } from "../../context/provider";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";

const Receive = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();

  const address = useMemo(() => {
    return isBTC ? btcKeys.address : ethKeys.address;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC]);

  const copyToClipboard = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(address);
    return Promise.reject("The Clipboard API is not available.");
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="RECEIVE" />
      <div className={styles.wrapper}>
        <QRCode className={styles.qrcode} value={address} />
        <div className={styles.address} onClick={copyToClipboard}>
          {address}
          <img src="/icons/icon_copy.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Receive;
