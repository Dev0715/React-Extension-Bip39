import { useState } from "react";
import { useGloabalStateContext } from "../../context/provider";
import styles from "./index.module.css";

const Header = () => {
  const { isBTC, setBTC, btcKeys } = useGloabalStateContext();
  const [isSelectable, setSelectable] = useState(false);
  
  const chains = [
    { symbol: "/icons/icon_ethereum.svg", name: "ETH" },
    { symbol: "/icons/icon_bitcoin.svg", name: "BTC" },
  ];

  const onMouseEnter_Chain = (e) => {
    setSelectable(true);
  };

  const onMouseLeave_Chain = (e) => {
    setSelectable(false);
  };

  const onMouseEnter_ChainSelect = (e) => {
    setSelectable(true);
  };

  const onMouseLeave_ChainSelect = (e) => {
    setSelectable(false);
  };

  const onClick_ChainSelect = (e) => {
    setBTC(!isBTC);
    setSelectable(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img className={styles.logo} src="/images/logo.white_side.svg" alt="" />
        <div className={styles.menus}>
          {/* Chain Option */}
          {btcKeys.address !== "" && (
            <div
              className={styles.menu}
              onMouseEnter={onMouseEnter_Chain}
              onMouseLeave={onMouseLeave_Chain}
            >
              <img
                className={styles.menu_logo}
                src={chains[Number(isBTC)].symbol}
                alt=""
              />
              <div className={styles.menu_name}>
                {chains[Number(isBTC)].name}
              </div>
              <img
                className={styles.menu_logo}
                src="/icons/icon_expand.png"
                alt=""
              />
            </div>
          )}
          {/* Language Option */}
          {/* <div className={styles.menu}>
            <img
              className={styles.menu_logo}
              src="/icons/icon_language.svg"
              alt=""
            />
            <div className={styles.menu_name}>English</div>
          </div> */}
          {
            /* Chain Select */
            isSelectable && (
              <div
                className={`${styles.menu_chain} ${styles.menu}`}
                onMouseEnter={onMouseEnter_ChainSelect}
                onMouseLeave={onMouseLeave_ChainSelect}
                onClick={onClick_ChainSelect}
              >
                <img
                  className={styles.menu_logo}
                  src={chains[Number(!isBTC)].symbol}
                  alt=""
                />
                <div className={styles.menu_name}>
                  {chains[Number(!isBTC)].name}
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
