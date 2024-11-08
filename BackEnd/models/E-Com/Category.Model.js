const mongoose = require('mongoose')

const category = new mongoose.Schema({


    name: {
        type: String,
        required: true
    }

}, {timestamps:true})

export default Category = mongoose.Model("Category", category)