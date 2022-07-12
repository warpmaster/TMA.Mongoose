const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        index: true,
        validate: [n => n.length >= 5 && n.length <= 400,
            "Title must be at least 5 chars long and no more than 400 chars"]
    },
    subtitle: {
        type: String,
        trim: true,
        required: false,
        validate: [n => n.length >= 5,
            "Subtitle must be at least 5 chars long"]
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
        validate: [n => n.length >= 5 && n.length <= 5000,
            "Description must be at least 5 chars long and no more than 5000 chars"]
    },
    category: {
        type: String,
        validate: [c => c === 'sport' || c === 'games' || c === 'history',
            "Valid categories are: sport, games, history"],
        required: true
    }}, {
    timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);