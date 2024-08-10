
import { Router } from 'next/router';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from '../../serviceAccountKey.js';

export default async function handler(req, res) {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  const db = getFirestore();
  let email = req.body.email;
  let newListAdd = req.body.list;
  let wordFromNewList = newListAdd.map(item => item.word);

  const docRef = await db.collection('VocabulariesData').where('Email', '==', email).get();
  let listInData = docRef.docs[0].data().Word;
  console.log("Old list from database is : "+ listInData);

  const wordMap = new Map();
  listInData.forEach(word => {
    wordMap.set(word, true);
  });
  wordFromNewList.forEach(word => {
    wordMap.set(word, true);
  });
  const uniqueWords = Array.from(wordMap.keys());

  console.log("After combine : " + uniqueWords);

  const docAddWords = await db.collection('VocabulariesData').doc(email).set({
    Email: email,
    Word: uniqueWords,
  });;
  console.log(docAddWords);
  res.status(200).json({ uniqueWords });
  //   let exist = true;
  //   const { email, password } = req.body.formData;
  //   const docRef = await db.collection('UserLogin').where('Email', '==', email).get();
  //   console.log("The quanitity of account " + docRef.docs.length);
  //   if (docRef.empty) {
  //     console.log("Invalid email or password");
  //     return res.status(401).json({ message: 'Invalid email or password' });
  //   } else {
  //     if (password !== docRef.docs[0].data().Password) {
  //       console.log("Invalid email or password");
  //       return res.status(401).json({ message: 'Invalid email or password' });
  //     }
  //   }
  //   console.log("Successful login!");
  //   res.status(200).json({ message: 'Logged in successfully' });
}