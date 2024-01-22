import {createContext, useState, useContext, useEffect} from 'react';
import {getLocalStorageItem} from '../app/functions';
import {useColorScheme} from 'react-native';
import {setStatusBarStyle} from 'expo-status-bar';

// Initiate context
const GlobalContextManger = createContext();

const GlobalContextProvider = ({children}) => {
  // Manage theme state
  const useSystemTheme = useColorScheme() === 'dark';
  const [theme, setTheme] = useState(null);
  const [userTxPreferance, setUserTxPereferance] = useState(null);
  const [nodeInformation, setNodeInformation] = useState({
    didConnectToNode: null,
    transactions: [],
    userBalance: 0,
    inboundLiquidityMsat: 0,
    blockHeight: 0,
    onChainBalance: 0,
  });

  function toggleTheme(peram) {
    setStatusBarStyle(peram ? 'light' : 'dark');
    setTheme(peram);
  }
  function toggleUserTxPreferance(num) {
    setUserTxPereferance(num);
  }

  useEffect(() => {
    (async () => {
      const storedTheme = await getLocalStorageItem('colorScheme');
      const storedUserTxPereferance = await getLocalStorageItem(
        'homepageTxPreferace',
      );
      if (JSON.parse(storedTheme) === 'system') {
        setTheme(useSystemTheme);
        setStatusBarStyle(useSystemTheme ? 'light' : 'dark');
      } else if (JSON.parse(storedTheme) === 'dark') {
        setTheme(true);
        setStatusBarStyle('light');
      } else {
        setTheme(false);
        setStatusBarStyle('dark');
      }

      if (storedUserTxPereferance) {
        setUserTxPereferance(JSON.parse(storedUserTxPereferance));
      } else {
        setUserTxPereferance(15);
      }
    })();
  }, []);

  if (theme === null || userTxPreferance === null) return;

  return (
    <GlobalContextManger.Provider
      value={{
        theme,
        toggleTheme,
        userTxPreferance,
        toggleUserTxPreferance,
        nodeInformation,
        setNodeInformation,
      }}>
      {children}
    </GlobalContextManger.Provider>
  );
};

function useGlobalContextProvider() {
  const context = useContext(GlobalContextManger);
  if (!context) {
    throw new Error(
      'useGlobalContextProvider must be used within a GlobalContextProvider',
    );
  }
  return context;
}

export {GlobalContextManger, GlobalContextProvider, useGlobalContextProvider};
