import express from 'express';
import cookieParser from './cookieParser';

const cookieParser = require('cookie-parser')
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}))

app.use(express.static("public"))

app.use(cookieParser())

export { app }