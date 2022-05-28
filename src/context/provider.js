import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({
  isBTC: true,
  isSwitchAble: true,
  password: "",
  mnemonic: "",
  btcKeys: { priv: "", pub: "", address: "" },
  ethKeys: { priv: "", pub: "", address: "" },
});
const { Provider: GlobalStatesProvider } = GlobalStateContext;

export const Provider = ({ children }) => {
  const [isBTC, setBTC] = useState(true);
  const [isSwitchAble, setSwitchAble] = useState(true);
  const [_password, _setPassword] = useState("");
  const [_mnemonic, _setMnemonic] = useState("");
  const [_address, _setAddress] = useState("");
  const [_amount, _setAmount] = useState("");
  const [btcKeys, setBtcKeys] = useState({ priv: "", pub: "", address: "" });
  const [ethKeys, setEthKeys] = useState({ priv: "", pub: "", address: "" });

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
      }}
    >
      {children}
    </GlobalStatesProvider>
  );
};

export const useGloabalStateContext = () => {
  return useContext(GlobalStateContext);
};
