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
  function toggleTheme(peram) {
    setStatusBarStyle(peram ? 'light' : 'dark');
    setTheme(peram);
  }
  // const colorScheme = await getLocalStorageItem('colorScheme');

  // setStatusBarHidden(false, 'fade');
  // if (!colorScheme) {
  //   if (sytemColorScheme) setStatusBarStyle('light');
  //   else setStatusBarStyle('dark');
  // } else {
  //   if (JSON.parse(colorScheme) === 'dark') setStatusBarStyle('light');
  //   else setStatusBarStyle('dark');
  // }
  //   NEED TO SQITCH COLOR SCHEME OF STYLEBAR

  useEffect(() => {
    (async () => {
      const storedTheme = await getLocalStorageItem('colorScheme');
      if (JSON.parse(storedTheme) === 'system') setTheme(useSystemTheme);
      else if (JSON.parse(storedTheme) === 'dark') setTheme(true);
      else setTheme(false);
    })();
  }, []);

  if (theme === null) return;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
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
