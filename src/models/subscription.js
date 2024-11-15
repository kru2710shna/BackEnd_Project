import mongoose , {Schema} from "mongoose"

const subscriptionSchema =  new Schema({
    subscriber : {
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    channel : {
        type: Schema.Types.ObjectId, // one to whom
        ref : "User" // is susbscribing
    }

}, {timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)