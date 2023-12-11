import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setLocalStorageItem(key, val) {
  try {
    await AsyncStorage.setItem(key, val);
    return true;
  } catch (error) {
    return false;
  }
}
export async function getLocalStorageItem(key) {
  try {
    const item = await AsyncStorage.getItem(key);

    if (item !== null) {
      const parsedItem = item;
      return parsedItem;
    }

    return item;
  } catch (error) {
    return false;
  }
}
export async function removeLocalStorageItem(key) {
  try {
    const item = await AsyncStorage.removeItem(key);

    if (item !== null) {
      const parsedItem = item;
      return parsedItem;
    }

    return item;
  } catch (error) {
    return false;
  }
}
