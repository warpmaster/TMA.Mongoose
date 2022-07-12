const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        validate: [n => n.length >= 4 && n.length <= 50,
            "First name must be at least 4 chars long and no more than 50 chars"]
    },

    lastName: {
        type: String,
        trim: true,
        required: true,
        validate: [n => n.length >= 3 && n.length <= 60,
            "Last name must be at least 3 chars long and no more than 60 chars"]
    },
    role: {
        type: String,
        validate: [r => r === 'admin' || r === 'writer' || r === 'guest',
            "Valid user roles are: admin, writer, guest"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    numberOfArticles: {
        type: Number,
        default: 0,
        required: false
    },
    nickname: {
        type: String,
        trim: true,
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema);