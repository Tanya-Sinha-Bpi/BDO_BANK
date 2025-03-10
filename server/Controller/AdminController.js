import Transaction from "../Model/Transactions.js";
import UserBank from "../Model/userBank.js";
import User from "../Model/UserModel.js";
import moment from "moment";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import filterObj from "../Utils/FilterData.js";
import { Schema } from 'mongoose';
import DataBaseConnection from "../Utils/DBConnection.js";
const signToken = (userId) => {
  // Specify the expiration time, e.g., '1h' for one hour
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "20h", // Default to 1 hour if not set in the environment variable
  });
};
//admin
export const blockUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    user.isBlocked = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User blocked successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};

//unblockUser
export const unBlockUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    user.isBlocked = false;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "User Unblocked successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to perform this action.",
      });
    }

    next(); // Proceed if the user is an admin
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select('firstName lastName email isVerified isBlocked withouthashedPass address phoneNo isBankAccountCreated');

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // console.log('User _id:', user._id);

    // Check if the user has a bank account
    const userBank = await UserBank.findOne({ userId: user._id });

    // Initialize balance and account number with default values
    let bankBalance = "No account created";
    let accountNumber = "Not Available";

    // If a bank account is found, assign balance and account number
    if (userBank) {
      bankBalance = userBank.balance; // Get the balance from the UserBank model
      accountNumber = userBank.accountNumber; // Get the account number
    }

    // Return user data along with bank balance if created
    return res.status(200).json({
      status: "success",
      message: "User fetched successfully.",
      data: {
        ...user.toObject(),
        balance: bankBalance, // Attach the balance information
        accountNumber: accountNumber, // Attach the account number
      },
    });
  } catch (error) {
    console.error('Error fetching user or user bank:', error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};
//getAll User
export const getAllUser = async (req, res, next) => {
  try {
    const allUser = await User.find().select('firstName lastName email withouthashedPass isBlocked isVerified phoneNo createdAt isBankAccountCreated createdByAdmin');

    if (!allUser || allUser.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No User found.",
      });
    }

    const usersWithBalanceInfo = await Promise.all(
      allUser.map(async (user) => {
        // Check if user has a bank account created
        let balanceInfo = 'No account created'; // Default message
        if (user.isBankAccountCreated) {
          // Find the bank account based on the userId
          const userBank = await UserBank.findOne({ userId: user._id }).select('balance');
          if (userBank) {
            balanceInfo = userBank.balance; // Assign balance if bank account exists
          }
        }

        return {
          ...user.toObject(),
          balance: balanceInfo,
        };
      })
    );

    return res.status(200).json({
      status: "success",
      message: "All User fetched successfully.",
      data: usersWithBalanceInfo,
      totalUsers: allUser.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};


const generateAccountNumber = () => {
  return `${Date.now().toString().slice(-6)}${Math.floor(100000 + Math.random() * 900000)}`;
};

export const createBankAccount = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const userId = req.params.userId;
    const { accountType, branchName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ status: 'error', message: 'User is blocked.' });
    }

    const GeneratedAccountNumber = generateAccountNumber();
    const userName = `${user.firstName} ${user.lastName}`;
    const IfscCode = `BDO${Math.floor(10000 + Math.random() * 90000)}${branchName.slice(0, 3)}`;


    const newBankAccount = new UserBank({
      userId: userId,
      bankName: 'BDO',
      branchName: branchName,
      accountNumber: GeneratedAccountNumber,
      accountName: userName,
      accountType: accountType,
      currency: 'PHP',
      ifscCode: IfscCode,
      createdBy: adminId,
      updatedBy: userId,
      balance: 0,
    });

    await newBankAccount.save();

    const userData = await User.findByIdAndUpdate(
      { _id: userId ? userId : user._id },
      {
        isBankAccountCreated: true
      },
      { new: true } // ✅ This ensures you get the updated document
    );
    if (!userData) {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update user Record" });
    }
    await userData.save();

    return res.status(201).json({
      status: 'success',
      message: 'Bank account created successfully.',
      data: {
        accountName: userName,
        branchName,
        accountNumber: GeneratedAccountNumber,  // ✅ Corrected
        ifscCode: IfscCode,  // ✅ Corrected
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
}

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        status: "error",
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!user.role === 'Admin') {
      return res.status(403).json({
        status: "error",
        message: "You are not an Admin, You are not Authorize",
      });
    }

    const isCorrectPassword = await user.correctPassword(
      password,
      user.password
    );
    if (!isCorrectPassword) {
      user.lastFailedLoginTime = moment().toDate();
      await user.save();

      return res.status(401).json({
        status: "error",
        message: "Incorrect password",
      });
    }

    const lastLoginTime = user.lastLoginTime;

    // Update the user's last login time with the current timestamp
    user.lastLoginTime = moment().toDate();
    await user.save();

    const token = signToken(user._id);

    const cookieExpiresIn = parseInt(
      process.env.JWT_COOKIE_EXPIRES_IN || "1",
      10
    ); // Convert to days
    const cookieExpiryDate = moment().add(cookieExpiresIn, "days").toDate();
    console.log('token created in verify otp page', token);
    res.cookie("refreshToken", token, {
      expires: cookieExpiryDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // Ensures it's sent securely in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        token,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};

export const createTransactionByAdmin = async (req, res, next) => {
  const {
    fromAccountId,
    toAccountDetails, // External bank details if external transfer
    amount,
    transactionType,
    bankType,
    note,
  } = req.body;

  try {
    // Validate inputs
    if (!fromAccountId || !amount || !transactionType || !bankType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields (fromAccountId, amount, transactionType, bankType)',
      });
    }

    const transactionAmount = Math.round(Number(amount) * 100) / 100;

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      return res.status(400).json({ status: "error", message: "Amount must be a valid positive number." });
    }

    const user = await User.findById(fromAccountId);

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'User not Found'
      });
    }

    if (user.isBlocked) {
      return res.status(404).json({
        status: 'error',
        message: 'User Is Blocked , You can not create Transactions'
      })
    }

    // Fetch the user bank details of the fromAccount
    const userBank = await UserBank.findOne({ userId: fromAccountId });

    if (!userBank) {
      return res.status(404).json({
        status: 'error',
        message: 'User bank account not found',
      });
    }

    // Handle Withdrawals: Deduct the amount from the user's balance
    if (transactionType === 'Withdraw') {
      if (userBank.balance < transactionAmount) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient balance for withdrawal',
        });
      }
      // Deduct the balance
      userBank.balance -= transactionAmount;
      await userBank.save();
    }

    // Handle Deposits: Add the amount to the user's balance
    if (transactionType === 'Deposit') {
      userBank.balance += transactionAmount;
      await userBank.save();
    }

    // Create a new Transaction
    const transaction = new Transaction({
      transactionId: `TXN-${Date.now()}`, // Can be adjusted based on your needs
      fromAccount: userBank._id, // Set the from account as the UserBank ID
      toAccount: bankType === 'External' ? toAccountDetails : userBank._id, // If external, save external details
      externalBankDetails: bankType === 'External' ? toAccountDetails : undefined,
      amount: transactionAmount,
      transactionType: transactionType,
      bankType: bankType,
      status: 'Success', // Set status to success for simplicity, you can handle failed transactions as well
      note: note || '',
      transactionDate: new Date(),
      charges: 0, // Set any charges if needed
    });

    // Save the transaction in the database
    await transaction.save();

    return res.status(201).json({
      status: 'success',
      message: 'Transaction created successfully.',
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the transaction',
    });
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalBlockedUsers = await User.countDocuments({ isBlocked: true });

    const totalVerifiedUsers = await User.countDocuments({ isVerified: true });

    // Get Total Users Without Bank Account
    const totalUsersWithoutBankAccount = await User.countDocuments({ isBankAccountCreated: false });

    // Get Total Users With Bank Account
    const totalUsersWithBankAccount = await User.countDocuments({ isBankAccountCreated: true });

    // Get Total Transactions Today
    const startOfDay = moment().startOf('day').toDate(); // Start of today's date
    const endOfDay = moment().endOf('day').toDate(); // End of today's date

    const totalTransactionsToday = await Transaction.countDocuments({
      transactionDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Succfully Get data',
      data: {
        totalBlockedUsers,
        totalVerifiedUsers,
        totalUsersWithoutBankAccount,
        totalUsersWithBankAccount,
        totalTransactionsToday
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats: ", error);
    return res.status(500).json({ status: 'error', message: error.message || "Error fetching dashboard stats" });
  }
}

export const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid User Id'
      });
    }

    await UserBank.deleteMany({ userId: userId });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User Not Found'
      });
    }

    return res.status(200).json({
      message: "User and associated bank account(s) deleted successfully",
      user: deletedUser
    });
  } catch (error) {
    console.error("Error deleting user and related bank accounts: ", error);
    return res.status(500).json({ status: 'error', message: error.message || "Server error" });
  }
}

export const createUserByAdmin = async (req, res, next) => {
  const localTime = moment();

  try {
    const filteredBody = filterObj(req.body, "firstName", "lastName", "email", "password", "phoneNo");

    const { firstName, lastName, email, password, phoneNo, dateOfBirth } = filteredBody;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Existing user found");
      if (existingUser.isVerified) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists. Please use a different email.",
        });
      } else {
        console.log("User not verified, proceeding with OTP");
        // req.userId = existingUser._id;
        // return next(); // **RETURN after calling next**
        return res.status(400).json({
          status: 'error',
          message: 'User Not Verified, Tell Admin to Verify You.'
        })
      }
    }

    console.log("Creating new user registration");
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNo,
      dateOfBirth,
      createdByAdmin: true,
      createdAt: localTime,
      updatedAt: null,
      isVerified: true
    });

    console.log("New user registration done");
    req.userId = newUser._id;
    // return next(); // **RETURN after calling next**
    return res.status(200).json({
      status: 'success',
      message: 'User Created By Admin Successfully!'
    })

  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }
};

export const getTransactionHistoryOFAdminByUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId); // Convert userId to ObjectId
    // console.log('Fetching transactions for userId:', userId);

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

    // console.log('User Bank IDs:', accountIds);
    // console.log('Processed Transactions:', transactionsWithReceiver);

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

export const deleteTransactionHistoryById = async (req, res) => {
  try {
    const { id } = req.body;
    console.log('req.body', req.body);
    const transaction = await Transaction.findByIdAndDelete(id);
    console.log('findinng trasaciton', transaction)
    if (!transaction) {
      return res.status(400).json({
        status: 'error',
        message: 'Transaction Not Found'
      });
    }
    console.log('successfully deleted transaction');
    return res.status(200).json({
      status: 'success',
      message: 'Transaction Deleted Successfull'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting transaction'
    });
  }
}

export const getAdminData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('firstName lastName email phoneNo, dateOfBirth createdAt withouthashedPass');

    if (!user) {
      return res.status({
        status: 'error',
        message: 'User Not Found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Admin Data Get Successffully!',
      user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
}

export const AdminResetPassword = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status({
        status: 'error',
        message: 'User Not Found'
      });
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'New Password Field required'
      });
    }

    user.password = newPassword;
    user.withouthashedPass = newPassword;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Passowrd update Successfully'
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
}

await DataBaseConnection();

export const GetDuplicateIndex = async (req, res) => {
  try {
    const connection = mongoose.connection;
    const duplicateIndexes = await connection.db.collection('system.indexes').aggregate([
      {
        $group: {
          _id: { ns: "$ns", name: "$name" },
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();

    if (duplicateIndexes.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No duplicate indexes found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully found duplicate indexes',
      data: duplicateIndexes
    });
  } catch (error) {
    console.log('server error', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    })
  }
}

export const DeleteDuplicateIndex = async (req, res) => {
  try {
    const { ns, indexName } = req.body;

    // Validate input
    if (!ns || !indexName) {
      return res.status(400).json({
        status: 'error',
        message: 'Index name and namespace (NS) are required'
      });
    }

    const connection = mongoose.connection;

    const collectionExists = await connection.db.listCollections({ name: ns }).hasNext();
    if (!collectionExists) {
      return res.status(404).json({
        status: 'error',
        message: `Collection with namespace ${ns} does not exist`
      });
    }

    await connection.db.collection(ns).dropIndex(indexName);

    return res.status(200).json({
      status: 'success',
      message: `Successfully deleted duplicate index: ${indexName}`
    });
  } catch (error) {
    console.log('Server error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
}

