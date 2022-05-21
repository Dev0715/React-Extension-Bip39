import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({
  isBTC: true,
  isSwitchAble: true,
});
const { Provider: GlobalStatesProvider } = GlobalStateContext;

export const Provider = ({ children }) => {
  const [isBTC, setBTC] = useState(true);
  const [isSwitchAble, setSwitchAble] = useState(true);

  return (
    <GlobalStatesProvider
      value={{ isBTC, setBTC, isSwitchAble, setSwitchAble }}
    >
      {children}
    </GlobalStatesProvider>
  );
};

export const useGloabalStateContext = () => {
  return useContext(GlobalStateContext);
};
