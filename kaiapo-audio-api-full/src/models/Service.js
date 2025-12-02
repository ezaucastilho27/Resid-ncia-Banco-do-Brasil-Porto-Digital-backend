const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    videoURL: { type: String, required: true },
    languages: [{type: String, default: ["Português"]}],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Service', ServiceSchema);