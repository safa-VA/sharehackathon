const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, default: 'Good' },
    image: { type: String, default: '' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    // Added 'picked_up' for the check-in process
    status: { type: String, enum: ['available', 'pending', 'rented', 'picked_up'], default: 'available' },
    requesterName: { type: String },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conditionNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);