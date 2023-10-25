import { Schema, model } from "mongoose";

const locationSchema = new Schema({
    name: String,
    business: {
        type: Schema.Types.ObjectId,
        ref: 'Businesses'
    },
    // This is the Google My Business Account ID
    // see https://developers.google.com/my-business/content/account-data
    gmbAccountId: {
        type: String,
        required: true
    },
    // This is the Google My Business Location ID
    // see https://developers.google.com/my-business/content/locations
    gmbLocationId: {
        type: String,
        required: true
    }
});

const Location = model("Location", locationSchema);

export default Location;