import {getLocalStorageItem} from './localStorage';

export default async function setColorScheme() {
  try {
    const colorSchemeStyle = await getLocalStorageItem('colorScheme');
    console.log('test color scheme', colorSchemeStyle);

    if (JSON.parse(colorSchemeStyle))
      return new Promise(response => {
        response(JSON.parse(colorSchemeStyle) === 'dark');
      });
    else
      return new Promise(response => {
        response(null);
      });
  } catch (err) {
    console.log(err);
  }
}
