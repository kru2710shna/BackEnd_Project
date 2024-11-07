const express = require('express');
const app = express();
require('dotenv').config()

app.get('/', (req, res) => {
    res.send("Hello World !")
})

app.get('/twitter', (req, res) => {
    res.send("Twitter !")
})

app.get('/login', (req, res) => {
    res.send("LOGIN!")
})

app.get('/backend', (req, res) => {
    res.send("BackEnd")
})

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})

