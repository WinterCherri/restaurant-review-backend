const { Schema, model } = require('mongoose');

// A business can be accessed by many users and can hold many accounts
// A user would be someone logging into the portal to see data
// An account would be an individual business account accessed via the
// Google My Business API 

const BusinessSchema = new Schema({
    name: String,
    users: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        role: {
            type: String,
            enum: ['member', 'admin'],
            default: 'member',
            required: true
        }
    }],
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Accounts' }]
}, { timestamps: true, collection: 'Businesses' });

BusinessSchema.methods = {
    addUser: async function (user) {
        this.users.push({ id: user._id });
        // update this on the user too
        user.businesses.push(this._id);
        return await Promise.all([this.save(), user.save()]);
    },
    addAccount: async function (account) {
        this.accounts.push(account);
        account.business = this._id;
        return await Promise.all([this.save(), account.save()]);
    }
};

/**
 * This model represents a business, which can have many users and many accounts
 * **You should use its methods to add users and accounts**, it will automatically configure the relationships
 * 
 * addUser(User) - adds a user to the business
 * 
 * addAccount(Account) - adds an account to the business
 */
const Business = model('Business', BusinessSchema);

module.exports = Business;
