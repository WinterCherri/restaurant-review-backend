const { Schema, model } = require('mongoose');

// A user can be a member of many businesses

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'User'
    },
    email: {
        type: String,
        required: true
    },
    loginMethods: {
        type: [
            {
                // This can be used to provide one of several
                // login methods, such as email, Google, Facebook, etc.
                // later on down the road
                provider: {
                    type: String,
                    enum: ['email'],
                    required: true
                },
                // This schema will be worked out later, but
                // for email it should just hold a bcrypt hash
                // TODO: flesh out data schema
                data: {
                    type: Object,
                    required: true
                }
            }
        ],
        // ensure user has at least one login method
        validate: v => Array.isArray(v) && v.length > 0,
    },
    businesses: [{
        type: Schema.Types.ObjectId,
        ref: 'Businesses'
    }]
}, { timestamps: true, collection: 'Users' });

const User = model('User', UserSchema);
module.exports = User;