import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    console.log("connectDB function called");

    if (!process.env.MONGODBURI || !DB_NAME) {
        console.error("MongoDB URI or Database Name is missing.");
        process.exit(1);
    }

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODBURI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`\nMongoose Connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;
