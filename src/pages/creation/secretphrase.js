import styles from "./secretphrase.module.css";
import { useGloabalStateContext } from "../../context/provider";
import { goTo } from "react-chrome-extension-router";
// import Login from "../login";
import Btn from "../../components/button";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";

import * as bip39 from "bip39";
import * as wif from "wif";
import { useEffect, useState } from "react";
import aes from "crypto-js/aes";
import Header from "../../components/header";
import SubHeader from "../../components/subheader";
import { isLiveMode } from "../../context/config";
import Home from "../home";

const SecretPhrase = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const { _password, setBtcKeys, setEthKeys } = useGloabalStateContext();
  const blurStyle = { filter: "blur(8px)", background: "#B0B0B0" };

  useEffect(() => {
    setMnemonic(bip39.generateMnemonic());
  }, []);

  const onCreate = () => {
    if (!copied) {
      setError(true);
      return;
    }
    console.log(mnemonic, _password);
    const encrypted = aes.encrypt(mnemonic, _password);
    localStorage.setItem("enp", encrypted);
    processMnemonic(mnemonic);
    // goTo(Login);
  };

  const onCopyPhrase = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(mnemonic);
    return Promise.reject("The Clipboard API is not available.");
  };

  const processMnemonic = async (mnemonic) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = HDKey.parseMasterSeed(seed);
    const btcDerivePath = isLiveMode ? "m/44'/0'/0'/0/0" : "m/44'/1'/0'/0/0";
    const btcNetwork = isLiveMode ? 128 : 239;
    const ethDerivePath = "m/44'/60'/0'/0/0";
    const btcWallet = masterKey.derive(btcDerivePath);
    const ethWallet = masterKey.derive(ethDerivePath);
    const btcKeys = {
      priv: wif.encode(btcNetwork, btcWallet.privateKey, true),
      pub: btcWallet.publicKey.toString("hex"),
      address: BitcoinAddress.from(
        btcWallet.publicKey,
        isLiveMode ? versions.bitcoinMain : versions.bitcoinTest
      ).address,
      balance: "...",
      _balance: 0,
      jpyRate: 0,
    };
    const ethKeys = {
      priv: ethWallet.privateKey.toString("hex"),
      pub: ethWallet.publicKey.toString("hex"),
      address: EthereumAddress.from(ethWallet.publicKey).address,
      balance: "....",
      _balance: 0,
      jpyRate: 0,
    };
    setBtcKeys(btcKeys);
    setEthKeys(ethKeys);

    if (btcKeys.address && ethKeys.address) {
      console.log("assertion for address");
      console.assert(BitcoinAddress.isValid(btcKeys.address));
      console.assert(EthereumAddress.isValid(ethKeys.address));
    }

    goTo(Home);
  };

  return (
    <div className={styles.container}>
      <Header />
      <SubHeader title="SET UP" />
      <div className={styles.wrapper}>
        <div className={styles.title}>Secret recovery phrase Don’t forget</div>
        <div className={styles.secretForm} style={!revealed ? blurStyle : {}}>
          <div className={styles.secret}>
            {mnemonic.split(" ").map((word, index) => (
              <div className={styles.input_wrapper} key={index}>
                <div className={styles.input_number}>
                  {index < 9 && <div className={styles.white_space}>0</div>}
                  {index + 1}.
                </div>
                <input defaultValue={word} />
              </div>
            ))}
          </div>
          <div className={styles.copy_btn}>
            <Btn
              title="COPY"
              left="/icons/icon_copy.svg"
              height="35px"
              color="darkgray"
              fontSize="14px"
              onClick={onCopyPhrase}
            />
          </div>
          <div
            className={styles.complete_check}
            style={error ? { color: "red", fontWeight: "bold" } : {}}
          >
            <input
              type="checkbox"
              name="complete_copy"
              checked={copied}
              onChange={(e) => setCopied(e.target.checked)}
            />
            Complete copy
          </div>
          <div className={styles.login_btn}>
            <Btn
              title="LOGIN"
              right="/icons/icon_arrow.svg"
              onClick={onCreate}
            />
          </div>
        </div>
        {!revealed && (
          <div className={styles.show_btn}>
            <Btn
              title="SHOW"
              left="/icons/icon_open.svg"
              color="#E3348C"
              height="35px"
              fontSize="14px"
              onClick={() => setRevealed(!revealed)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretPhrase;
