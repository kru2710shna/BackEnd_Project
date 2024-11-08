import mongoose from 'mongoose';

const hospital = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    specializedIn: [
        {
            type: String
        }
    ] 


}, { timestamps: true })


export default Hospital = mongoose.model("Hospital", hospital)