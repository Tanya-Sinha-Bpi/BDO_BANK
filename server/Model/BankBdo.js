import mongoose from 'mongoose';

const otherBankSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
},{timestamps: true});

const OtherBank = mongoose.model('OtherBank', otherBankSchema);

export default OtherBank;