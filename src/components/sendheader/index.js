import { chainSymbol } from "../../context/config";
import styles from "./index.module.css";

const SendHeader = ({ toAddress, amount, step, error }) => {
  const isBtcAddr = toAddress.substr(0, 2) === "0x" ? false : true;
  const steps = [
    {
      titile: "Signing Complete",
      approved: false,
      text: "Waiting for approval",
    },
    { titile: "Tx is approved", approved: true, text: "Tx is approved" },
    { titile: "Send TX", approved: false, text: "Waiting for broadcast" },
    {
      titile: "Tx gets confirmed",
      approved: false,
      text: "Waiting for Tx confirmation",
    },
  ];

  const shortAddress = (_address) => {
    const len = _address.length;
    const _short =
      _address.substr(0, isBtcAddr ? 3 : 5) +
      "..." +
      _address.substr(len - 4, 4);
    return _short;
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.to_address}>
          <img src="/icons/icon_address.svg" alt="" />
          <div className={styles.label_to}>To</div>
          {shortAddress(toAddress)}
        </div>
        <div className={styles.sending_amount}>
          {parseFloat(amount).toFixed(5)}
          <div className={styles.chain_symbol}>
            {chainSymbol[Number(isBtcAddr)]}
          </div>
        </div>
        <div className={styles.status_bar}>
          {steps.map((_step, index) => (
            <div className={styles.step_one} key={index}>
              {index > 0 && (
                <div
                  className={styles.step_connect}
                  style={{
                    backgroundColor: index <= step ? "#0096F4" : "lightgray",
                  }}
                />
              )}
              <div
                className={styles.step_stone}
                style={{
                  backgroundColor: index <= step ? "#0096F4" : "lightgray",
                }}
              >
                <div
                  className={styles.step_title}
                  style={{
                    color: index <= step ? "#0096F4" : "lightgray",
                  }}
                >
                  {_step.titile}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.status}>
          {error ? (
            <img src="/icons/icon_circle_cancel.svg" alt="" />
          ) : step === 4 ? (
            <img src="/icons/icon_confirm.svg" alt="" />
          ) : steps[step].approved ? (
            <img src="/icons/icon_information.svg" alt="" />
          ) : (
            <img src="/images/waiting.gif" alt="" />
          )}
        </div>
        <div
          className={styles.text}
          style={{
            color: step === 4 || steps[step].approved ? "#81D056" : "#E3348C",
          }}
        >
          {error
            ? "Failed sending tx"
            : step < 4
            ? steps[step].text
            : "Confirmed"}
        </div>
        {step === 1 && (
          <div
            className={styles.text}
            style={{ color: "#81D056", marginTop: 0 }}
          >
            Press SEND TX to broadcast
          </div>
        )}
      </div>
    </div>
  );
};

export default SendHeader;
