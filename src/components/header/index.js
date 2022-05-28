import { useMemo } from "react";
import { goBack } from "react-chrome-extension-router";
import ReactSwitch from "react-switch";
import { useGloabalStateContext } from "../../context/provider";
import { BtcIcon, EthIcon } from "../../context/svgs";
import styles from "./index.module.css";

const Header = () => {
  const { isBTC, setBTC, isSwitchAble, btcKeys, ethKeys } =
    useGloabalStateContext();

  const shortAddress = useMemo(() => {
    const _address = isBTC ? btcKeys.address : ethKeys.address;
    const len = _address.length;
    if (len === 0) return "No Address";
    else
      return (
        _address.substr(0, isBTC ? 3 : 5) + "..." + _address.substr(len - 4, 4)
      );
  }, [isBTC, btcKeys, ethKeys]);

  const SwithContent = ({ title }) => {
    return (
      <div className={styles.switch_content_wrapper}>
        <div className={styles.switch_content}>{title}</div>
      </div>
    );
  };

  const SwitchIcon = ({ isBTC }) => {
    return (
      <div className={styles.switch_icon_wrapper}>
        <div className={styles.switch_icon}>
          {isBTC ? <BtcIcon /> : <EthIcon />}
        </div>
      </div>
    );
  };

  const onClickAddress = () => {
    const _address = isBTC ? btcKeys.address : ethKeys.address;
    copyToClipboard(_address)
      .then(() => {
        console.log("Copied");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyToClipboard = (str) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  };

  const onBack = () => {
    goBack();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <ReactSwitch
          id="network-radius-switch"
          checked={isBTC}
          onChange={setBTC}
          handleDiameter={24}
          onColor="#6A4DFD"
          offColor="#6A4DFD"
          onHandleColor="#FFF"
          offHandleColor="#FFF"
          width={80}
          height={32}
          borderRadius={6}
          activeBoxShadow="0px 0px 1px 1px #FFF"
          checkedIcon={<SwithContent title="BTC" />}
          uncheckedIcon={<SwithContent title="ETH" />}
          checkedHandleIcon={<SwitchIcon isBTC={true} />}
          uncheckedHandleIcon={<SwitchIcon isBTC={false} />}
          disabled={!isSwitchAble}
        />
        <div className={styles.title} onClick={onClickAddress}>
          {shortAddress}
        </div>
        <div className={styles.back_wrapper} onClick={onBack}>
          <img className={styles.back} src="./icon-back.png" alt="back" />
        </div>
      </div>
    </div>
  );
};

export default Header;
