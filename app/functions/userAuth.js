import {useEffect, useState} from 'react';
// import {router} from 'expo-router';
import {AppState} from 'react-native';
import {retrieveData} from './secureStore';

const userAuth = navigate => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') {
        // The app has transitioned to the background or inactive state (e.g., when the user switches to a different app).
        console.log('background');
        (async () => {
          const userPin = await retrieveData('mnemonic');

          if (userPin) {
            navigate('AdminLogin');
          } else {
            navigate('Home');
          }
        })();
      }

      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      // Unsubscribe from the listener when the component unmounts
      appStateSubscription.remove();
    };
  }, [appState]);
};

export default userAuth;
