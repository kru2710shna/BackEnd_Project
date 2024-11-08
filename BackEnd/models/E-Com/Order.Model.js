const mongoose = require('mongoose')

const orderItem = new mongoose.Schema({

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }

})


const order = new mongoose.Schema({

    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: {
        type: [orderItem]
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "DELIEVERED", "CANCELLED"],
        default: "PENDING"

    }

}, { timestamps: true })

export default Order = mongoose.Model("Order", order)