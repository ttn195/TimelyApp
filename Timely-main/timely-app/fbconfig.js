import firebase from 'firebase';
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDFxWaoigAkc1ioQ18IJboPtVupU8-hn8Y",
  authDomain: "looper-a2cea.firebaseapp.com",
  databaseURL: "https://looper-a2cea.firebaseio.com",
  projectId: "looper-a2cea",
  storageBucket: "looper-a2cea.appspot.com",
  messagingSenderId: "953645514664",
  appId: "1:953645514664:web:9632ddecbc608eba7f279d",
};


firebase.initializeApp( firebaseConfig );

export default firebase;