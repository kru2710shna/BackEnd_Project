const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000; // Default port if not specified in .env

const jokes = [
  { id: '1', title: 'Joke_1' },
  { id: '2', title: 'Joke_2' },
  { id: '3', title: 'Joke_3' },
  { id: '4', title: 'Joke_4' },
];

app.get('/api/jokes', (req, res) => {
  res.json(jokes);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
