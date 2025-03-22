'use client'
import firebase from 'firebase/app'
import { useSelector } from 'react-redux';
import { websettingsData } from 'src/store/reducers/webSettings';
require('firebase/auth')
require('firebase/firestore')

const FirebaseData = () => {
  const websettingsdata = useSelector(websettingsData);

  const apiKeyData = websettingsdata && websettingsdata?.firebase_api_key;
  const authDomainData = websettingsdata && websettingsdata?.firebase_auth_domain;
  const databaseURLData = websettingsdata && websettingsdata?.firebase_database_url;
  const projectIdData = websettingsdata && websettingsdata?.firebase_project_id;
  const storageBucketData = websettingsdata && websettingsdata?.firebase_storage_bucket;
  const messagingSenderIdData = websettingsdata && websettingsdata?.firebase_messager_sender_id;
  const appIdData = websettingsdata && websettingsdata?.firebase_app_id;
  const measurementIdData = websettingsdata && websettingsdata?.firebase_measurement_id;

  let firebaseConfig = {
      apiKey: apiKeyData ? apiKeyData : "AIzaSyCjzCkSY1_QGja1D_EHzpJCLjR_f4d-5_4",
      authDomain: authDomainData ? authDomainData : "kontest-7ec0f.firebaseapp.com",
      databaseURL: databaseURLData ? databaseURLData : "https://kontest-7ec0f-default-rtdb.firebaseio.com",
      projectId: projectIdData ? projectIdData : "kontest-7ec0f",
      storageBucket: storageBucketData ? storageBucketData : "kontest-7ec0f.firebasestorage.app",
      messagingSenderId: messagingSenderIdData ? messagingSenderIdData : "659814084659",
      appId: appIdData ? appIdData : "1:659814084659:web:f22e9cb00468d050baf346",
      measurementId: measurementIdData ? measurementIdData : "G-B6G1G9V09R",
  }

  // eslint-disable-next-line
  if (!firebase.apps?.length) {
    firebase.initializeApp(firebaseConfig)
  } else {
    firebase.app() // if already initialized, use that one
  }

  const auth = firebase.auth()

  const db = firebase.firestore()

  const googleProvider = new firebase.auth.GoogleAuthProvider()

  const facebookprovider = new firebase.auth.FacebookAuthProvider()

  return { auth, googleProvider, facebookprovider, firebase, db }
}

export default FirebaseData
