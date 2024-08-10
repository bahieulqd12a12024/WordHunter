
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
    let isLearning = false;
    let email = req.body.email;
    let word = req.body.word;
    let docRefOfWord = await db.collection('VocabulariesData').where('Email', '==', email).get();
    let currentList = docRefOfWord.docs[0].data().Word;
    currentList.forEach(eachWord => {
        if (eachWord === word) {
            isLearning = true;
        };
    });
    currentList = currentList.filter(eachWord => eachWord !== word);
    console.log(currentList);
    await db.collection('VocabulariesData').doc(email).update({
        Word: currentList
    })
        .catch(function (error) {
            console.error("Error removing document: ", error);
        });
    if (isLearning === true) {
        let docRefDateInData = await db.collection('ProgressLearning').doc(email).get();
        let dateInData = docRefDateInData.data().Date;
        let numberOfWord = docRefDateInData.data().NumberOfWord;
        let numberOfWordCopy = [...numberOfWord];
        console.log(numberOfWord);
        let currentDateJson = new Date();
        let dateInDataJson = new Date(dateInData);
        console.log(dateInDataJson);
        currentDateJson.setUTCHours(0, 0, 0, 0);
        dateInDataJson.setUTCHours(0, 0, 0, 0);
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
        }
        numberOfWord[6]++;
        await db.collection('ProgressLearning').doc(email).update({
            NumberOfWord: numberOfWord
        });
    };
    res.status(200).json({ message: 'Deleting successfully' });
}