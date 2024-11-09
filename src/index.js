// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from './db/db.js';

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        application.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ' ${process.env.PORT}`)

        })
    })
    .catch((error) => {
        console.error("Connection Failed", error)
    })

console.log("Attempting to connect to MongoDB...");





// import epress from 'express'
// const app = express()


//     (async () => {
//         try {
//             await mongoose.connect(`${process.env.MONGODBURI}/${DB_NAME}`)
//             app.on("error", (error) => {
//                 console.log("Error connection", error)
//             })

//             app.listen(process.env.PORT, () => {
//                 console.log(`App listening on port , ${process.env.PORT}`)
//             })
//         } catch (error) {
//             console.error("Error", error)
//             throw error

//         }

//     })()
