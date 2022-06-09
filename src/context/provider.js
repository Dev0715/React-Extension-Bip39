import axios from "axios";
import { createContext, useContext, useState } from "react";
import useInterval from "react-useinterval";
import { blockcypherApi, GetAppStateInterval, isLiveMode } from "./config";
import { toBTC, toETH } from "./utils";

const GlobalStateContext = createContext({
  isBTC: true,
  isSwitchAble: true,
  btcKeys: { priv: "", pub: "", address: "", balance: 0, jpyRate: 0 },
  ethKeys: { priv: "", pub: "", address: "", balance: 0, jpyRate: 0 },
  _txHash: "",
});
const { Provider: GlobalStatesProvider } = GlobalStateContext;

export const Provider = ({ children }) => {
  const [isBTC, setBTC] = useState(true);
  const [isSwitchAble, setSwitchAble] = useState(true);
  const [btcKeys, setBtcKeys] = useState({
    priv: "",
    pub: "",
    address: "",
    balance: 0,
    jpyRate: 0,
  });
  const [ethKeys, setEthKeys] = useState({
    priv: "",
    pub: "",
    address: "",
    balance: 0,
    jpyRate: 0,
  });
  const [_password, _setPassword] = useState("");
  const [_mnemonic, _setMnemonic] = useState("");
  const [_address, _setAddress] = useState("");
  const [_amount, _setAmount] = useState("");
  const [_txData, _setTxData] = useState("");
  const [_txHash, _setTxHash] = useState("");

  useInterval(() => {
    getAppState();
  }, GetAppStateInterval);

  const getAppState = async () => {
    const jpyRate = await getJpyRate();
    const balance = await getBalance();
    if (isBTC) setBtcKeys({ ...btcKeys, jpyRate, balance: toBTC(balance) });
    else setEthKeys({ ...ethKeys, jpyRate, balance: toETH(balance) });
  };

  const getJpyRate = async () => {
    const chain = isBTC ? "bitcoin" : "ethereum";
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${chain}`
    );
    const rate = res.data.market_data.current_price["jpy"];
    console.log("JPY Rate", rate);
    return rate;
  };

  const getBalance = async () => {
    try {
      const address = isBTC ? btcKeys.address : ethKeys.address;
      if (address !== "") {
        const res = await axios.get(
          `${
            blockcypherApi[Number(isLiveMode)][Number(isBTC)]
          }/addrs/${address}/balance`
        );
        console.log("Balance Info", res.data);
        return res.data.balance;
      }
    } catch (err) {
      console.log(err);
    }
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
        _password,
        _setPassword,
        _mnemonic,
        _setMnemonic,
        _address,
        _setAddress,
        _amount,
        _setAmount,
        _txData,
        _setTxData,
        _txHash,
        _setTxHash,
      }}
    >
      {children}
    </GlobalStatesProvider>
  );
};

export const useGloabalStateContext = () => {
  return useContext(GlobalStateContext);
};
