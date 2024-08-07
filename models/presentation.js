const mongoose = require('mongoose');
const { Schema } = mongoose;

const presentationSchema = new Schema({
    title: { type: String, required: true, unique: true },
    authors: { type: [String], required: true },
    dateOfPublishment: { type: Date, default: Date.now },
    slides: [{type: mongoose.Types.ObjectId, default: [], ref: 'Presentation'}]
});


module.exports = mongoose.model('Presentation', presentationSchema);