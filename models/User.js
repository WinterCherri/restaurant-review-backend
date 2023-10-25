import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: "User"
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    photo: {
        type: String
    },
    credentials: [{
        type: {
            type: String,
            enum: ["GoogleCredential"]
        },
        credential: {
            type: Schema.Types.ObjectId
        }
    }]
});

const User = model("User", UserSchema);

export default User;