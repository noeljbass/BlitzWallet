import {createContext, useState, useContext, useEffect} from 'react';
import {getLocalStorageItem} from '../app/functions';
import {useColorScheme} from 'react-native';
import {setStatusBarStyle} from 'expo-status-bar';

// Initiate context
const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
  // Manage theme state
  const useSystemTheme = useColorScheme() === 'dark';
  const [theme, setTheme] = useState(null);
  const [userTxPreferance, setUserTxPereferance] = useState(null);

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
    <ThemeContext.Provider
      value={{theme, toggleTheme, userTxPreferance, toggleUserTxPreferance}}>
      {children}
    </ThemeContext.Provider>
  );
};

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export {ThemeContext, ThemeProvider, useTheme};
