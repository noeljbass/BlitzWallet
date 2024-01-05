import connectToNode from './connectToNode';
import {getLocalStorageItem, setLocalStorageItem} from './localStorage';
import RotatingAnimation from './rotatingAnimation';
import {retrieveData, terminateAccount, storeData} from './secureStore';
import generateMnemnoic from './seed';
import shuffleArray from './shuffleArray';

export {
  connectToNode,
  retrieveData,
  terminateAccount,
  storeData,
  generateMnemnoic,
  shuffleArray,
  RotatingAnimation,
  getLocalStorageItem,
  setLocalStorageItem,
};
