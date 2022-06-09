import cryptoJs from "crypto-js";
import aes from "crypto-js/aes";
import { useEffect, useState } from "react";
import { goTo } from "react-chrome-extension-router";
import Btn from "../../components/button";
import Creation from "../creation";
import ForgotPassword from "../creation/forgotpassword";
import Home from "../home";
import styles from "./index.module.css";
import * as bip39 from "bip39";
import { HDKey, BitcoinAddress, EthereumAddress, versions } from "wallet.ts";
import { useGloabalStateContext } from "../../context/provider";
import {
  blockcypherApi,
  blockcypherApiKey,
  isLiveMode,
} from "../../context/config";
import axios from "axios";

let useFlag = 0;

const Login = () => {
  const [password, setPassword] = useState("");
  const [isStarted, setStarted] = useState(false);
  const [isError, setError] = useState(false);
  const { setBtcKeys, setEthKeys } = useGloabalStateContext();

  useEffect(() => {
    useFlag = 1 - useFlag;
    if (!useFlag) return;
    console.log("Login", useFlag);

    const enp = localStorage.getItem("enp");
    if (enp !== null) {
      setStarted(true);
    }
  }, []);

  const changePassword = (e) => {
    setError(false);
    setPassword(e.target.value);
  };

  const unLock = () => {
    const decrypted = localStorage.getItem("enp");
    try {
      const mnemonic = aes
        .decrypt(decrypted, password)
        .toString(cryptoJs.enc.Utf8);
      if (mnemonic.split(" ").length === 12) {
        processMnemonic(mnemonic);
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const processMnemonic = async (mnemonic) => {
    if (isLiveMode) {
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const masterKey = HDKey.parseMasterSeed(seed);

      const btcWallet = masterKey.derive("m/44'/1'/0'/0/3");
      const ethWallet = masterKey.derive("m/44'/60'/0'/0/2"); //index:0
      const btcKeys = {
        priv: btcWallet.privateKey.toString("hex"),
        pub: btcWallet.publicKey.toString("hex"),
        address: BitcoinAddress.from(btcWallet.publicKey, versions.bitcoinMain)
          .address,
        // : BitcoinAddress.from(btcWallet.publicKey, versions.bitcoinTest).address,
        balance: 0,
        jpyRate: 0,
      };
      const ethKeys = {
        priv: ethWallet.privateKey.toString("hex"),
        pub: ethWallet.publicKey.toString("hex"),
        address: EthereumAddress.from(ethWallet.publicKey).address,
        balance: 0,
        jpyRate: 0,
      };
      setBtcKeys(btcKeys);
      setEthKeys(ethKeys);

      if (btcKeys.address && ethKeys.address) {
        console.log("assertion for address");
        console.assert(BitcoinAddress.isValid(btcKeys.address));
        console.assert(EthereumAddress.isValid(ethKeys.address));
      }
    } else {
      // Test Mode
      try {
        for (let isBTC = 0; isBTC < 2; isBTC++) {
          const res = await axios.post(
            `${blockcypherApi[0][isBTC]}/addrs?token=${blockcypherApiKey}`
          );

          const data = {
            priv: res.data.private,
            pub: res.data.public,
            address: res.data.address,
            balance: 0,
            jpyRate: 0,
          };
          if (isBTC) setBtcKeys(data);
          else setEthKeys({ ...data, address: "0x" + data.address });

          await axios.post(
            `${blockcypherApi[0][isBTC]}/faucet?token=${blockcypherApiKey}`,
            {
              address: res.data.address,
              amount: isBTC ? 1 * Math.pow(10, 8) : 1 * Math.pow(10, 18),
            }
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    goTo(Home);
  };

  const getStarted = () => {
    goTo(Creation);
  };

  const onForgot = () => {
    goTo(ForgotPassword);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>WALLET</div>
      {isStarted ? (
        <div className={styles.inputForm}>
          {isError && (
            <div className={styles.errorMessage}>{"Password is invalid!"}</div>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={changePassword}
          />
          <Btn title="Unlock" onClick={unLock} />
          <div className={styles.forgot} onClick={onForgot}>
            Forgot password?
          </div>
        </div>
      ) : (
        <div className={styles.startForm}>
          <Btn title="GET STARTED" onClick={getStarted} />
        </div>
      )}
    </div>
  );
};

export default Login;
