const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        unique: true,
        required: true
    }

}, {timestamps:true})

export default User = mongoose.Model("User", user)