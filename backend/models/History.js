import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Register",
        required: true
    },
    plantName: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    image: {
        type: String, // base64 representation
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const HistoryModel = mongoose.model("History", HistorySchema);
export default HistoryModel;
