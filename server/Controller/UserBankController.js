import Transaction from "../Model/Transactions.js";
import UserBank from "../Model/userBank.js";
import { v4 as uuidv4 } from "uuid";
import User from "../Model/UserModel.js";
import mongoose from "mongoose";
import sendMail from "../Utils/Mailer.js";
import { SuccessTransactionEmail } from "../Templates/SuccessTransactionEmail.js";

const generateAccountNumber = () => {
    return `${Date.now().toString().slice(-6)}${Math.floor(
        100000 + Math.random() * 900000
    )}`;
};

const calculateTransactionFees = (amount, bankType) => {
    let fee = 0;

    // If it's a SameBank transfer, the fee is 10 PHP
    if (bankType === 'SameBank') {
        fee = 5; // SameBank transactions have a fixed fee of 10 PHP
    }
    // If it's an External transfer, the fee is 25 PHP
    else if (bankType === 'External') {
        fee = 25; // External transactions have a fixed fee of 25 PHP
    }

    return fee;
};

const generateTransactionRef = () => {
    const part1 = Math.floor(Math.random() * 1000000); // Generate random number (1 to 999999)
    const part2 = Math.floor(Math.random() * 100000000); // Generate random number (1 to 99999999)
    return `BN-${part1}-${part2}`;
};

const formatTransactionDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`; // Format as MM/DD/YYYY
};
export const createTransaction = async (req, res) => {
    try {
        const { fromAccount, toAccount, amount, transactionType, bankType, note, externalBankDetails } = req.body;

        const senderTransactionType = 'Withdraw'; // Sender is withdrawing money
        const receiverTransactionType = 'Deposit'; // Receiver is depositing money

        const transactionFees = calculateTransactionFees(amount, bankType);
        const transactionAmount = Math.round(Number(amount) * 100) / 100;

        if (isNaN(transactionAmount) || transactionAmount <= 0) {
            return res.status(400).json({ status: "error", message: "Amount must be a valid positive number." });
        }

        // Find sender account by accountNumber
        const senderAccount = await UserBank.findOne({ accountNumber: fromAccount }).populate("userId");
        if (!senderAccount) {
            return res.status(404).json({ status: "error", message: "Sender account not found." });
        }

        let receiverAccount = null;
        let updatedSenderBalance = senderAccount.balance;
        let updatedReceiverBalance = null;
        let toAccountValue = null;

        // Handle deposit and withdrawal for SameBank or External bank types
        if (transactionType === "Withdraw") {
            if (senderAccount.balance < transactionAmount + transactionFees) {
                return res.status(400).json({ status: "error", message: "Insufficient balance." });
            }
            updatedSenderBalance -= (transactionAmount + transactionFees); // Withdraw from sender account
        } else if (transactionType === "Deposit") {
            updatedSenderBalance += transactionAmount; // Deposit to sender account
        }

        // Handle SameBank transfer
        if (bankType === "SameBank") {
            receiverAccount = await UserBank.findOne({ accountNumber: toAccount });
            if (!receiverAccount) {
                return res.status(404).json({ status: "error", message: "Receiver account not found." });
            }

            receiverAccount.balance += transactionAmount; // Transfer amount to receiver account
            updatedReceiverBalance = receiverAccount.balance;
            await receiverAccount.save();

            toAccountValue = receiverAccount._id;
        }

        // Handle External bank transfer (Requires external details)
        if (bankType === "External") {
            if (!externalBankDetails || !externalBankDetails.accountNumber) {
                return res.status(400).json({ status: "error", message: "External bank details are required." });
            }
            // Process external transfer logic here (you might not update the receiver account in the system)
            updatedReceiverBalance = null; // No balance change in the system for external transfers
            toAccountValue = externalBankDetails.accountNumber;
        }

        // Update sender account balance
        senderAccount.balance = updatedSenderBalance;
        await senderAccount.save();

        // Create Transaction Entry for Sender (Withdraw)
        const senderTransaction = new Transaction({
            // transactionId: uuidv4(),
            transactionId: generateTransactionRef(),
            fromAccount: senderAccount._id,  // Sender account
            //toAccount: receiverAccount ? receiverAccount._id : externalBankDetails?.accountNumber || null,
            toAccount: toAccountValue,
            amount: transactionAmount,
            transactionType: senderTransactionType, // Withdraw for sender
            bankType,
            externalBankDetails: bankType === 'External' ? externalBankDetails : null,
            note,
            status: "Success",
            transactionDate: new Date(),
            charges: transactionFees, // Set charges for sender
        });

        // Save the sender transaction
        await senderTransaction.save();
        // (sourceAcc, DestBankName, DestAccNo, amount, ServiceCh, TrDate, TrRefNo)
        const preData = {
            sourceAcc: senderAccount.accountNumber,
            DestBankName: bankType === 'External' ? externalBankDetails.bankName : receiverAccount.accountName,
            DestAccNo: bankType === 'External' ? externalBankDetails.accountNumber : receiverAccount.accountNumber,
            amount,
            ServiceCh: transactionFees,
            TrDate: formatTransactionDate(new Date()),
            TrRefNo: generateTransactionRef(),
        }
        console.log('prev data email', preData)
        console.log('recipient email data email', senderAccount.userId.email);
        const emailData = {
            recipient: senderAccount.userId.email,
            sender: "shouryasinha.c@gmail.com",
            subject: "BDO Online Send Money via InstaPay Successfull",
            html: SuccessTransactionEmail(preData.sourceAcc, preData.DestBankName, preData.DestAccNo, preData.amount, preData.ServiceCh, preData.TrDate, preData.TrRefNo),
        }

        await sendMail(emailData);

        // If it's a SameBank transfer, create receiver's transaction (Deposit)
        if (bankType === 'SameBank') {
            const receiverTransaction = new Transaction({
                transactionId: uuidv4(),
                fromAccount: receiverAccount._id,
                toAccount: senderAccount._id,
                amount: transactionAmount,
                transactionType: receiverTransactionType, // Deposit for the receiver
                bankType,
                externalBankDetails: null,
                note,
                status: "Success",
                transactionDate: new Date(),
                charges: 0, // No charges for the receiver
            });

            // Save the receiver transaction
            await receiverTransaction.save();
        }

        return res.status(201).json({
            status: "success",
            message: "Transaction successful",
            transaction: senderTransaction,
            senderBalance: updatedSenderBalance,
            receiverBalance: updatedReceiverBalance || null
        });

    } catch (error) {
        console.error("Transaction Error:", error);
        return res.status(500).json({ status: "error", message: "Transaction failed" });
    }
};

export const createBankAcountByUser = async (req, res, next) => {
    try {
        const { userId, firstName, lastName, dateOfBirth, phoneNo, address, email } =
            req.body;
        let user;
        if (userId) {
            user = await User.findById(userId);
        } else {
            user = await User.findOne({ email });
        }

        if (!user) {
            return res
                .status(404)
                .json({ status: "error", message: "User not found." });
        }

        if (user.isBlocked) {
            return res
                .status(403)
                .json({ status: "error", message: "User is blocked." });
        }

        const GeneratedAccountNumber = generateAccountNumber();
        const userName = `${user.firstName} ${user.lastName}`;

        const firstPart = user.firstName?.length > 2 ? user.firstName.slice(1, 3) : user.firstName || "";
        const lastPart = user.lastName?.length > 2 ? user.lastName.slice(2) : user.lastName || "";
        const branchNameCreated = `${firstPart}${lastPart}`;

        const IfscCode = `BDO${Math.floor(10000 + Math.random() * 90000)}${branchNameCreated.slice(0, 3)}`;

        const newBankAccount = new UserBank({
            userId: user._id,
            bankName: "BDO",
            branchName: branchNameCreated,
            accountNumber: GeneratedAccountNumber,
            accountName: userName,
            accountType: "Savings",
            currency: "PHP",
            ifscCode: IfscCode,
            createdBy: user._id,
            balance: 0,
        });
        await newBankAccount.save();

        const userData = await User.findByIdAndUpdate(
            { _id: userId ? userId : user._id },
            {
                firstName,
                lastName,
                address,
                phoneNo,
                dateOfBirth,
                isBankAccountCreated: true
            },
            { new: true } // ✅ This ensures you get the updated document
        );
        if (!userData) {
            return res
                .status(500)
                .json({ status: "error", message: "Failed to create bank account. Problem in your Name" });
        }
        await userData.save();

        return res.status(201).json({
            status: "success",
            message: "Bank account created successfully.",
            data: {
                accountName: userName,
                branchName: branchNameCreated, // ✅ Fixed
                accountNumber: GeneratedAccountNumber, // ✅ Fixed
                ifscCode: IfscCode, // ✅ Fixed
            },
        });
    } catch (error) {
        console.error("Create Bank Account Error:", error);
        return res
            .status(500)
            .json({
                status: "error",
                message: "Failed to create bank account.",
                error,
            });
    }
};

export const getBankAccountDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            })
        }
        if (user.isBlocked) {
            return res.status(403).json({
                status: "error",
                message: "User is blocked."
            })
        }
        const userBank = await UserBank.findOne({ userId }).populate("userId", "firstName lastName");
        if (!userBank) {
            return res.status(404).json({
                status: "error",
                message: "Bank account not found.",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Bank account details retrieved successfully.",
            bankDetails: {
                firstName: userBank.userId.firstName,
                lastName: userBank.userId.lastName,
                accountName: userBank.accountName,
                branchName: userBank.branchName,
                accountNumber: userBank.accountNumber,
                ifscCode: userBank.ifscCode,
                balance: userBank.balance,
                createdAt: userBank.createdAt,
            },
        })
    } catch (error) {
        console.error("Get Bank Account Details Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve bank account details.",
            error,
        });
    }
}

export const getUserData = async (req, res, next) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        if (user.isBlocked) {
            return res.status(403).json({ status: "error", message: "User is blocked." });
        }

        return res.status(200).json({
            status: "success",
            message: "User data retrieved successfully.",
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Get User Data Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve user data.",
            error,
        });
    }
}

export const checkAccountCreeation = async (req, res, next) => {
    try {
        const userId = req.userId;
        let user;
        if (userId) {
            user = await User.findById(userId);
        } else {
            user = await User.findOne({ email: req.body.email });
        }
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        const isAccountCreated = user.isBankAccountCreated;

        return res.status(200).json({
            status: "success",
            message: "Account Creation Status retrieved successfully.",
            data: {
                isAccountCreated
            }
        });
    } catch (error) {
        console.error("Check Account Creation Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve account creation status.",
            error,
        });
    }
}

export const getTransactionHistory = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId); // Convert userId to ObjectId
        console.log('Fetching transactions for userId:', userId);

        // Fetch the user's bank account(s) using the userId
        const userBanks = await UserBank.find({ userId }).select('accountNumber _id'); // Get account numbers and _id
        const accountIds = userBanks.map(bank => bank._id); // Extract bank _ids

        // Fetch only transactions where the user is the sender (Withdraw transactions)
        const sentTransactions = await Transaction.find({
            fromAccount: { $in: accountIds }  // User must be the sender
        })
            .populate({
                path: 'fromAccount',
                select: 'accountNumber accountName',
                model: UserBank
            });

        // Process transactions to handle `toAccount` properly
        const transactionsWithReceiver = sentTransactions.map(tx => {
            let receiverDetails;

            if (tx.bankType === 'SameBank') {
                receiverDetails = {
                    accountNumber: tx.toAccount?.accountNumber || 'N/A',
                    accountName: tx.toAccount?.accountName || 'N/A'
                };
            } else {
                receiverDetails = {
                    accountNumber: tx.externalBankDetails?.accountNumber || 'N/A',
                    accountName: tx.externalBankDetails?.accountName || 'N/A',
                    bankName: tx.externalBankDetails?.bankName || 'N/A',
                    ifscCode: tx.externalBankDetails?.ifscCode || 'N/A'
                };
            }

            return {
                ...tx.toObject(),
                receiverDetails
            };
        });

        console.log('User Bank IDs:', accountIds);
        console.log('Processed Transactions:', transactionsWithReceiver);

        return res.status(200).json({
            success: true,
            transactions: transactionsWithReceiver  // Return transactions with updated receiver details
        });

    } catch (error) {
        console.error('Error getting transactions:', error);
        return res.status(500).json({
            success: false,
            message: 'Error getting transactions'
        });
    }
};

export const getUserDataById = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('User ID received in controller:', req.params.userId);
        const user = await User.findById(userId).select('firstName lastName email withouthashedPass isBlocked isVerified createdAt phoneNo');
        console.log('user found', user)
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }

        const userBank = await UserBank.findOne({ userId: userId }).select('accountNumber balance'); // Select only the necessary fields
        console.log('userbank found', userBank);
        if (!userBank) {
            return res.status(404).json({ status: "error", message: "Bank account not found for this user." });
        }

        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            withouthashedPass: user.withouthashedPass,
            isBlocked: user.isBlocked,
            isVerified: user.isVerified,
            accountNumber: userBank.accountNumber,
            balance: userBank.balance || 0,
            createdAt: user.createdAt,
            phoneNo: user.phoneNo
        };

        return res.status(200).json({ status: "success", data: userData });

    } catch (error) {
        console.error("Get User Data by ID Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve user data.",
            error,
        });
    }
}

export const requestAccountClosure = async (req, res) => {
    try {
        const { accountNumber } = req.body;
        const userId = req.userId; 

        // Find the bank account by account number and userId
        const userBank = await UserBank.findOne({ accountNumber, userId });

        if (!userBank) {
            return res.status(404).json({ status: 'warning', message: 'Bank account not found.' });
        }

        // Check if there is already a closure request
        if (userBank.accountClosedRequest) {
            return res.status(400).json({ status: 'warning', message: 'Account closure request already made.' });
        }

        // Update the account closure request status
        userBank.accountClosedRequest = true;
        userBank.accountClosedRequestDate = new Date(); // Track request date
        userBank.status = 'Pending';

        await userBank.save();

        return res.status(200).json({
            status: 'success',
            message: 'Account closure request sent successfully.',
            data: userBank
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message || 'An error occurred while processing the request.' });
    }
};

export const requestAccountReopening = async (req, res) => {
    try {
        const { accountNumber } = req.body;
        const userId = req.userId;

        // Find the bank account by account number and userId
        const userBank = await UserBank.findOne({ accountNumber, userId });

        if (!userBank) {
            return res.status(404).json({ status: 'warning', message: 'Bank account not found.' });
        }

        // Check if the account is already open
        if (!userBank.accountClosed) {
            return res.status(400).json({ status: 'warning', message: 'Account is already open. Cannot reopen.' });
        }

        // Check if there is already a reopening request
        if (userBank.accountReopenRequest) {
            return res.status(400).json({ status: 'warning', message: 'Account reopening request already made.' });
        }

        // Update the account reopening request status
        userBank.accountReopenRequest = true;
        userBank.accountClosedRequestDate = new Date(); // Track request date
        userBank.status = 'Pending';

        await userBank.save();

        return res.status(200).json({
            status: 'success',
            message: 'Account reopening request sent successfully.',
            data: userBank
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message || 'An error occurred while processing the request.' });
    }
};

