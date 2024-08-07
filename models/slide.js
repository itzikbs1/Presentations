const mongoose = require('mongoose');
const { Schema } = mongoose;

const slideSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    presentationId: {type: mongoose.Types.ObjectId, required: true, ref: 'Presentation'}
});

module.exports = mongoose.model('Slide', slideSchema);