import dotenv from "dotenv";
import connectDB from './db/db.js';
import app from './app.js'; // Import the app

dotenv.config({
    path: './.env'
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.error("Connection Failed", error);
    });

