import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'



const connectDB = async () => {
    console.log("connectDB function called");

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODBURI}/${DB_NAME}`)
        console.log(`\n Mongoose Connect !! DB HOST: ${connectionInstance.connection.host}`);


    } catch (error) {
        console.error("MongoDB Connection Failed ", error)
        process.exit(1)

    }
}

export default connectDB;