import { useEffect, useState } from "react";
import { router } from "expo-router";
import { AppState } from "react-native";
import { retrieveData } from "./dataStorage";

const userAuth = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background") {
        // The app has transitioned to the background or inactive state (e.g., when the user switches to a different app).
        (async () => {
          const userPin = await retrieveData("pin");

          if (userPin) {
            router.push("/inAccount/login");
          } else {
            router.push("/newAccount/home");
          }
        })();
      }

      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      // Unsubscribe from the listener when the component unmounts
      appStateSubscription.remove();
    };
  }, [appState]);
};

export default userAuth;
