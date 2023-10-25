import { Schema, model } from "mongoose";

const businessSchema = new Schema({
    name: String,
    members: [{
        type: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    }],
    // locations: []
});

const Business = model("Business", businessSchema);

export default Business;