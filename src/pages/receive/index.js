import { useMemo } from "react";
import styles from "./index.module.css";
import QRCode from "react-qr-code";
import { useGloabalStateContext } from "../../context/provider";

const Receive = () => {
  const { isBTC, btcKeys, ethKeys } = useGloabalStateContext();

  const address = useMemo(() => {
    return isBTC ? btcKeys.address : ethKeys.address;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBTC]);

  return (
    <div className={styles.wrapper}>
      <QRCode value={address} />
      <input placeholder="Address" readOnly value={address} />
    </div>
  );
};

export default Receive;
