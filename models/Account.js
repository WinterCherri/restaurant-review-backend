const { Schema, model } = require('mongoose');

// An account is an individual location that is accessed via the Google My Business API

const AccountSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'My Account'
    },
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
}, { timestamps: true, collection: 'Accounts' });

const Account = model('Account', AccountSchema);
module.exports = Account;