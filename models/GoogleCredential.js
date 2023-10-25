import { Schema, model } from "mongoose";

const GoogleCredentialSchema = new Schema({
    refreshToken: {
        type: String,
        unique: true
    },
    profileId: {
        type: String,
        unique: true
    }
});

const GoogleCredential = model("GoogleCredential", GoogleCredentialSchema);

export default GoogleCredential;