import firebase from 'firebase/app';
import 'firebase/auth';

// TODO: NEEDED TO RUN PROJECT
import config from './firebase-config.json';

const firebaseApp = firebase.initializeApp(config);

const auth = firebaseApp.auth();

export {
  firebaseApp as firebase,
  auth,
};
