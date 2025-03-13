import mongoose from 'mongoose';

const userBankSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountName: {
        type: String,
        required: true,
        // unique: true, // Ensure account name is unique
        // minlength: [3, "Account Name must be atleast 3 characters length"],
        // maxlength: [50, "Account Name must be atmost 50 characters length"]
    },
    bankName: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        unique: true, // Ensure account number is unique
        required: true
    },
    accountType: {
        type: String,
        enum: ['Savings', 'Current', 'Business'],
        required: true
    },
    currency: {
        type: String,
        default: 'PHP' // Change this based on your system
    },
    ifscCode: { // For India, you can rename to 'routingNumber' for other countries
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Pending'],
        default: 'Active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If an admin creates the account
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    accountClosedRequest: {
        type: Boolean,
        default: false
    },
    accountReopenRequest: {
        type: Boolean,
        default: false
    },
    accountClosedRequestDate:{
        type: Date,
        default: null
    },
    accountClosed:{
        type: Boolean,
        default: false,
    },
    accountClosedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const UserBank = mongoose.model('UserBank', userBankSchema);
export default UserBank;
