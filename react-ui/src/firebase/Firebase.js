import firebase from 'firebase';
var keys = require('./Keys');

//DO NOT FORGET TO CHANGE rules TO != from === after EVERYTHING IS DONE
// Initialize Firebase
var config = {
  apiKey: keys.apiKey,
  authDomain: keys.authDomain,
  databaseURL: keys.databaseURL,
  projectId: keys.projectId,
  storageBucket: keys.storageBucket,
  messagingSenderId: keys.messagingSenderId
};
// export var firebaseApp = firebase.initializeApp(config);
var firebaseApp = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
//console.log(firebaseApp.options);
export default firebaseApp;