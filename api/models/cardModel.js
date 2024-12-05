const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,

    },
    lastname: {
        type: String,
        required: true,

    },
    picture: {
        type: String,
        required: true,

    },
    bonus: {
        type: String,
        required: true,

    },
    malus: {
        type: String,
        required: true,

    },
}, {timestamps: true});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;