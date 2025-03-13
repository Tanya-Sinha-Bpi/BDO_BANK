import mongoose from 'mongoose';

const telecomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
    address: {
        type: String,
        required: false
    },
    contactNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    website: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
},{timestamps: true});

const TelecomProvider = mongoose.model('Telecom', telecomSchema);

export default TelecomProvider;