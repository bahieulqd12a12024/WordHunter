import axios from 'axios';
import axiosRetry from 'axios-retry';


export default async function handler1(req, res) {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${req.body.word}`);
    console.log(response.data);
    res.status(200).json(response.data);
  } 
  catch (error) {
    return res.status(500).json({ error: 'Error fetching word from dictionary API' });
  }
}