/**
 * Configuration
 * @module config
 */

import NPMPackage from '../../package.json';

const config = {
  name: NPMPackage.name,
  title: NPMPackage.title,
  description: NPMPackage.description,
  firebase: {
    apiKey: 'AIzaSyAEsMUc_grpmQgf9gJnDFyFuSe4L736ONY',
    authDomain: 'logos-c87b5.firebaseapp.com',
    databaseURL: 'https://logos-c87b5.firebaseio.com',
    storageBucket: '',
  },
  startReactotron: false
};

export default config;
