import dotenv from "dotenv";
import connectDB from './db/db.js';
import app from './app.js'; // Import the app

// Load environment variables
dotenv.config({
    path: './.env',
});

// Call connectDB and start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Connection Failed:", error.message);
    });
