import express from 'express';
import cookieParser from 'cookie-parser'; // Correct import for cookie-parser
import cors from 'cors'; // Import cors middleware
import userRouter from './routes/user.routes.js'; // Import your user routes

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Ensure CORS_ORIGIN is defined in .env
    credentials: true // Fixed typo from "credential" to "credentials"
}));
app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    limit: "16kb",
    extended: true
}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes setup
// e.g., /api/v1/users/register
app.use('/api/v1/users', userRouter);

export default app; // Export app as default
