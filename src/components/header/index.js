import { goBack } from "react-chrome-extension-router";
import ReactSwitch from "react-switch";
import { useGloabalStateContext } from "../../context/provider";
import { BtcIcon, EthIcon } from "../../context/svgs";
import styles from "./index.module.css";

const Header = () => {
  const { isBTC, setBTC, isSwitchAble } = useGloabalStateContext();

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
        <div className={styles.title}>
          {isBTC ? "3FZ...tZc5" : "0x7F4...893e"}
        </div>
        <div className={styles.back_wrapper} onClick={onBack}>
          <img className={styles.back} src="./icon-back.png" alt="back" />
        </div>
      </div>
    </div>
  );
};

export default Header;
