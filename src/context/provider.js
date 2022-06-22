import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import useInterval from "react-useinterval";
import {
  blockcypherApi,
  blockcypherApiKey,
  GetAppStateInterval,
  GetTxStateInterval,
  isLiveMode,
} from "./config";
import { toBTC, toETH } from "./utils";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import aes from "crypto-js/aes";

const GlobalStateContext = createContext({
  isBTC: true,
  isSwitchAble: true,
  btcKeys: {
    priv: "",
    pub: "",
    address: "",
    balance: "...",
    jpyRate: 0,
    _balance: 0,
  },
  ethKeys: {
    priv: "",
    pub: "",
    address: "",
    balance: "...",
    jpyRate: 0,
    _balance: 0,
  },
});
const { Provider: GlobalStatesProvider } = GlobalStateContext;

export const Provider = ({ children }) => {
  const [isBTC, setBTC] = useState(true);
  const [isSwitchAble, setSwitchAble] = useState(true);
  const [btcKeys, setBtcKeys] = useState({
    priv: "",
    pub: "",
    address: "",
    balance: "...",
    jpyRate: 0,
    _balance: 0,
  });
  const [ethKeys, setEthKeys] = useState({
    priv: "",
    pub: "",
    address: "",
    balance: "...",
    jpyRate: 0,
    _balance: 0,
  });
  const [isStarted, setIsStarted] = useState(false);
  const [_password, _setPassword] = useState("");
  const [_mnemonic, _setMnemonic] = useState("");
  const [_address, _setAddress] = useState("");
  const [_amount, _setAmount] = useState("");
  const [_txDataToSend, _setTxDataToSend] = useState("");
  const [_activityToConf, _setActivityToConf] = useState("");
  const [_txHash, _setTxHash] = useState("");
  const [_step, _setStep] = useState(1);
  const [_userName, _setUserName] = useState("");

  useInterval(() => {
    getAppState();
  }, GetAppStateInterval);

  // What is the main purpose of txHash and txData !?
  // txData is for passing txData.
  useEffect(() => {
    if (!_activityToConf?.finalTxHash) return;
    const timerId = setInterval(
      getTxState(_activityToConf.finalTxHash),
      GetTxStateInterval
    );
    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_activityToConf]);

  const getAppState = async () => {
    savePassword();
    const jpyRate = await getJpyRate();
    const balRes = await getBalance();
    if (isBTC)
      setBtcKeys({
        ...btcKeys,
        jpyRate,
        balance: toBTC(balRes?.balance),
        _balance: toBTC(balRes?._balance),
      });
    else
      setEthKeys({
        ...ethKeys,
        jpyRate,
        balance: toETH(balRes?.balance),
        _balance: toETH(balRes?._balance),
      });
  };

  const savePassword = () => {
    if (_password !== "") {
      const today = new Date();
      const curTime = today.getTime() / 1000;
      const encrypted = aes.encrypt(_password, curTime.toString());
      localStorage.setItem("enw", encrypted);
      localStorage.setItem("exp", curTime);
    }
  };

  const getJpyRate = async () => {
    const chain = isBTC ? "bitcoin" : "ethereum";
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${chain}`
    );
    const rate = res.data.market_data.current_price["jpy"];
    return rate;
  };

  const getBalance = async () => {
    try {
      const address = isBTC ? btcKeys.address : ethKeys.address;
      if (address !== "") {
        const res = await axios.get(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/addrs/${address}/balance?token=${blockcypherApiKey}`
        );
        return {
          balance: res.data.final_balance,
          _balance: res.data.unconfirmed_balance,
        };
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTxState = async (_finalTxHash) => {
    try {
      // console.log("getTxState:", _finalTxHash);
      axios
        .get(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/txs/${_finalTxHash}?token=${blockcypherApiKey}`
        )
        .then((res) => {
          if (res?.data?.confirmations > 0) {
            console.log("Got 1 conf");
            removeDoc().then((res) => {
              _setStep(_step + 1);
              _setActivityToConf("");
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const removeDoc = async () => {
    await deleteDoc(doc(db, "transaction", _activityToConf.docId));
    console.log("Document with ID was deleted: ", _activityToConf.docId);
  };

  return (
    <GlobalStatesProvider
      value={{
        isBTC,
        setBTC,
        isSwitchAble,
        setSwitchAble,
        btcKeys,
        setBtcKeys,
        ethKeys,
        setEthKeys,
        isStarted,
        setIsStarted,
        _password,
        _setPassword,
        _mnemonic,
        _setMnemonic,
        _address,
        _setAddress,
        _amount,
        _setAmount,
        _txDataToSend,
        _setTxDataToSend,
        _activityToConf,
        _setActivityToConf,
        _txHash,
        _setTxHash,
        _step,
        _setStep,
        _userName,
        _setUserName,
      }}
    >
      {children}
    </GlobalStatesProvider>
  );
};

export const useGloabalStateContext = () => {
  return useContext(GlobalStateContext);
};
