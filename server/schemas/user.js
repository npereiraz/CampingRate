const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
        type: String,
        maxlength: 14,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 254,
    },
    password: {
        type: String,
        required: true,
    },
})
// Create a case-insensitive index on the 'username' field
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;