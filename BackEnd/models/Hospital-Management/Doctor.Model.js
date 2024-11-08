import mongoose from 'mongoose';


const doctor = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    worksInHospitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
    ]



}, { timestamps: true })


export default doctor = mongoose.model("Doctor", doctor)