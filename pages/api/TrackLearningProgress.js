
import { Router } from 'next/router';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from '../../serviceAccountKey.json';

export default async function handler(req, res) {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    }
    const db = getFirestore();
    let email = req.body.email;
    let docRefDateInData = await db.collection('ProgressLearning').doc(email).get();
    let dateInData = docRefDateInData.data().Date;
    let numberOfWord = docRefDateInData.data().NumberOfWord;
    let numberOfWordCopy = [...numberOfWord];
    console.log(numberOfWord);
    let currentDateJson = new Date();
    let dateInDataJson = new Date(dateInData);
    console.log(dateInDataJson);
    currentDateJson.setUTCHours(0,0,0,0);
    dateInDataJson.setUTCHours(0,0,0,0);
    let dayDifference = (currentDateJson - dateInDataJson) / (1000 * 3600 * 24);
    console.log(dayDifference);
    if (dayDifference > 0) {
        for (let i = 6; i > -1; i--) {
          if (i - dayDifference > -1) {
            numberOfWord[i - dayDifference] = numberOfWordCopy[i];
          }
        }
        for (let i = 0; i < dayDifference; i++) {
            if (6 - i > -1) {
            numberOfWord[6 - i] = 0;
            }
        }
        await db.collection('ProgressLearning').doc(email).update({
            NumberOfWord: numberOfWord
        });
    }
    res.status(200).json({ message: 'Deleting successfully' , numberOfWord });
}