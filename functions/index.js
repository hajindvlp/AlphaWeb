const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./secrets/serviceAccountKey.json');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyBjhSWhRfannMH2XXm3zyxFRScjrlTexPg",
  authDomain: "alphaweb-63c8c.firebaseapp.com",
  databaseURL: "https://alphaweb-63c8c.firebaseio.com",
  projectId: "alphaweb-63c8c",
  storageBucket: "alphaweb-63c8c.appspot.com",
  messagingSenderId: "277876252608",
  appId: "1:277876252608:web:1cf7a0c17ba8623529f225",
  measurementId: "G-7SPPEJZBQ8"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://alphaweb-63c8c.firebaseio.com"
});

const db = admin.firestore();
const docs = db.collection('docs');

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ls", (req, res) => {
  docs.doc('dir').get().then((titles) => {
    let fileList = titles.data().list;

    res.status(200).json({
      list: fileList
    })
  })
})

app.post("/upload", (req, res) => {
  let title = req.body.fn.split("..").join("");
  let content = req.body.content;

  docs.add({
    title,
    content
  })

  docs.doc('dir').get().then(titles => {
    let fileList = titles.data().list;
    
    fileList.push(title);
    docs.doc("dir").set(
      {list: fileList}
    )
  })
})

app.post('/cat', (req, res) => {
  let title = req.body.fn;
  console.log(title);

  docs.where('title', '==', title).get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        res.status(200).json({
          content: doc.data().content
        })
      })
    }).catch((err) => {
      if(err) res.status(500).json({
        content: "file not found"
      })
    })
})

app.get("*", (req, res) => {
  res.send("hello");
})

const api = functions.https.onRequest(app);

module.exports = { api };