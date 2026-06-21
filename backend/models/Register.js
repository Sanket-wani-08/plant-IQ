import mongoose from "mongoose";

const RegSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    pass: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Regmodel = mongoose.model("Register", RegSchema);

export default Regmodel;