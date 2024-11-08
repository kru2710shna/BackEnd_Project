import mongoose from 'mongoose';

const patient = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    diagnosedWith: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
        required: true
    },
    admittedIN: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Hospital",
        required: true
    }



}, { timestamps: true })


export default Patient = mongoose.model("Patient", patient)