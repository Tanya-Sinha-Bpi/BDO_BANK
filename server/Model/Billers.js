import mongoose from 'mongoose';

const billerSchema = new mongoose.Schema({
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

const Biller = mongoose.model('Biller', billerSchema);

export default Biller;