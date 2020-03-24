import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as express from 'express';
import * as engines from 'consolidate';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const firebaseApp = firebase.initializeApp(config).firestore();

function getFacts() {
  const toDoRef = firebaseApp.collection('todo')
  return toDoRef.get().then((snap) => {
    return snap.docs.map(doc => doc.data())
  });
}

export const expressApp = express();
expressApp.engine('hbs', engines.handlebars);
expressApp.set('views', './views');
expressApp.set('view engine', 'hbs');

expressApp.get('/functions', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  getFacts().then(data => {
    response.render('index', { data });
  }).catch(err => console.log(err))
});

expressApp.get('/functions.json', (request, response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600')
  getFacts().then(data => {
    response.json(data);
  }).catch(err => console.log(err))
});

export const app = functions.https.onRequest(expressApp);
