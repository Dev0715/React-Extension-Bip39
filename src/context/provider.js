import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({
  isBTC: true,
  isSwitchAble: true,
  btcKeys: { priv: "", pub: "", address: "" },
  ethKeys: { priv: "", pub: "", address: "" },
  _txHash: ""
});
const { Provider: GlobalStatesProvider } = GlobalStateContext;

export const Provider = ({ children }) => {
  const [isBTC, setBTC] = useState(true);
  const [isSwitchAble, setSwitchAble] = useState(true);
  const [btcKeys, setBtcKeys] = useState({ priv: "", pub: "", address: "" });
  const [ethKeys, setEthKeys] = useState({ priv: "", pub: "", address: "" });
  const [_password, _setPassword] = useState("");
  const [_mnemonic, _setMnemonic] = useState("");
  const [_address, _setAddress] = useState("");
  const [_amount, _setAmount] = useState("");
  const [_txData, _setTxData] = useState("");
  const [_txHash, _setTxHash] = useState("");

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
        _setTxHash
      }}
    >
      {children}
    </GlobalStatesProvider>
  );
};

export const useGloabalStateContext = () => {
  return useContext(GlobalStateContext);
};
