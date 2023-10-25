import { Schema, model } from "mongoose";

const PasswordCredentialSchema = new Schema({
    password: {
        type: String,
        unique: true
    }
});

const PasswordCredential = model("PasswordCredential", PasswordCredentialSchema);

export default PasswordCredential;