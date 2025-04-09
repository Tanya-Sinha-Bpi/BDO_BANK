import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
        required: true
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserBank',
        required: true
    },
    toAccount: {
        type: mongoose.Schema.Types.Mixed,  // Can be ObjectId (SameBank) or String (External)
        required: true
    },
    externalBankDetails: {
        bankName: { type: String },
        ifscCode: { type: String },
        accountNumber: { type: String },
        accountName: { type: String },
        adminExtBankName:{type:String},
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    transactionType: { // Deposit or Withdraw
        type: String,
        enum: ['Deposit', 'Withdraw'],
        required: true
    },
    bankType: { // SameBank or External
        type: String,
        enum: ['SameBank', 'External'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        required: true,
        default: 'Pending'
    },
    note: {
        type: String,
        default: ''
    },
    transactionDate: {
        type: Date,
        default: new Date(),
    },
    charges: {
        type: Number,
        default: 0 // Transaction fees for external transfers
    },
    // adminExtBankName:{
    //     type:String
    // }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
