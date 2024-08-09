
import { Router } from 'next/router';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter, addDoc } from 'firebase-admin/firestore';
import serviceAccount from '../../serviceAccountKey.json';

export default async function handler(req, res) {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    }
    const db = getFirestore();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    console.log("Current Date: " + dateString);
    const { fullname, email, password } = req.body.formData;
    console.log(fullname);
    console.log(email);
    console.log(password);
    const docRef = await db.collection('UserLogin').get();
    const docRefMore = docRef.docs;
    for (let i = 0; i < docRefMore.length; i++) {
        if (docRefMore[i].data().Email === email) {
            return res.status(401).json({ message: 'Email is already existed!' });
        }
    }
      await db.collection('UserLogin').doc(email).set({
        Name: fullname,
        Email: email,
        Password: password,
      });

      await db.collection('VocabulariesData').doc(email).set({
        Email: email,
        Word: [],
      });

      await db.collection('ProgressLearning').doc(email).set({
        Email: email,
        NumberOfWord: [0, 0, 0, 0, 0, 0, 0],
        Date: dateString,
      });

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
        res.status(200).json({ message: 'Logged in successfully' });
}