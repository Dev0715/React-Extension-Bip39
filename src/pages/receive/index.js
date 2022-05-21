import { useState } from "react";
import styles from "./index.module.css";
import QRCode from "react-qr-code";

const Receive = () => {
  const [address, setAddress] = useState("0x7F47ab4BD1A63EeCEEFf1F3A268B7AAF39Ca893e");

  return (
    <div className={styles.wrapper}>
      <QRCode value="0x7F47ab4BD1A63EeCEEFf1F3A268B7AAF39Ca893e" />
      <input
        placeholder="Address"
        readOnly
        value={address}
        // onChange={(e) => setAddress(e.target.value)}
      />
    </div>
  );
};

export default Receive;
