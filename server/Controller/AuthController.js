import otpGenerator from "otp-generator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import moment from "moment";
import filterObj from "../Utils/FilterData.js";
import User from "../Model/UserModel.js";
import { SendingOtp } from '../Templates/Otp.js';
import sendMail from "../Utils/Mailer.js";
const signToken = (userId) => {
    // Specify the expiration time, e.g., '1h' for one hour
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "20h", // Default to 1 hour if not set in the environment variable
    });
};

export const registerUser = async (req, res, next) => {
    const localTime = moment();

    try {
        const filteredBody = filterObj(req.body, "firstName", "lastName", "email", "password", "phoneNo");

        const { firstName, lastName, email, password } = filteredBody;

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
                req.userId = existingUser._id;
                return next(); // **RETURN after calling next**
            }
        }

        console.log("Creating new user registration");
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            createdAt: localTime,
            updatedAt: null,
        });

        console.log("New user registration done");
        req.userId = newUser._id;
        return next(); // **RETURN after calling next**

    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
};

export const sendOtp = async (req, res, next) => {
    const localTime = moment();
    const newTime = localTime.add(10, "minutes").toDate();
    try {
        console.log('req.body.email', req.body.email);
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email is required to send OTP",
            });
        }
        let user;
        const userId = req.userId;
        if (userId) {
            user = await User.findById(userId);
        } else {
            console.log("user in verify", req.body.email);
            user = await User.findOne({ email });
        }
        // Correctly retrieving the user ID from the request object

        if (user.isBlocked) {
            return res.status(403).json({
                status: "error",
                message: "User is blocked. Please contact support.",
            });
        }

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        console.log("otp", otp);
        user.otpExpiryTime = newTime;
        user.otp = otp;

        await user.save({ new: true, validateModifiedOnly: true });
        const username = `${user.firstName} ${user.lastName}`;
        // Send an email
        const emailData = {
            recipient: user.email,
            sender: "shouryasinha.c@gmail.com",
            subject: "Verification OTP",
            html: SendingOtp(username, otp),
        };

        await sendMail(emailData);

        return res.status(200).json({
            status: "success",
            message: "OTP sent successfully for Verification",
            email: user.email,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        // console.log("req body in verify otp", req.body);
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        if (user.isOtpExpired()) {
            return res.status(400).json({
                status: "error",
                message: "OTP has expired. Please generate a new OTP.",
            });
        }

        if (!otp) {
            return res.status(400).json({
                status: "error",
                message: "OTP is required",
            });
        }

        // Compare OTP
        const isValidOtp = await user.correctOtp(otp, user.otp);

        if (!isValidOtp) {
            return res.status(400).json({
                status: "error",
                message: "Incorrect OTP",
            });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiryTime = null;
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
            message: "Account verified successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
};

export const loginUser = async (req, res, next) => {
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

        if (user.isBlocked) {
            return res.status(403).json({
                status: "error",
                message: "User is blocked. Please contact support.",
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
        // console.log('token created in verify otp page',token);
        res.cookie("refreshToken", token, {
            expires: cookieExpiryDate,
            httpOnly: true,
            secure: process.env.NODE_ENV === "Render" ? true : false, // Ensures it's sent securely in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            // sameSite:'None',
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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Generate OTP using otp-generator
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        user.otp = otp; // Will be hashed due to pre("save") middleware
        user.otpExpiryTime = moment().add(10, "minutes").toDate(); // OTP expires in 10 mins

        await user.save();
        const username = `${user.firstName} ${user.lastName}`;
        const emailData = {
            recipient: user.email,
            sender: "shouryasinha.c@gmail.com",
            subject: "Verification OTP",
            html: SendingOtp(username, otp),
        };

        await sendMail(emailData);

        console.log('otp for debug', otp)
        return res.status(200).json({ status: "success", message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email) {
            return res.status(400).json({ status: "error", message: "Email is required" });
        }
        if (!otp) {
            return res.status(400).json({ status: "error", message: "OTP is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ status: "error", message: "New password is required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Check if OTP is expired
        if (user.isOtpExpired()) {
            return res.status(400).json({ status: "error", message: "OTP has expired" });
        }

        // Validate OTP
        const isOtpValid = await user.correctOtp(otp, user.otp);
        if (!isOtpValid) {
            return res.status(400).json({ status: "error", message: "Invalid OTP" });
        }

        // Update password (hashed automatically)
        user.password = newPassword;
        user.otp = undefined; // Clear OTP after successful reset
        user.withouthashedPass = newPassword;
        user.otpExpiryTime = undefined;

        await user.save(); // Triggers password hashing

        res.status(200).json({ status: "success", message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
};

// export const protect = async (req, res, next) => {
//     try {
//         let token;

//         token = req.cookies.refreshToken;

//         if (!token) {
//             return res.status(403).json({
//                 status: "error",
//                 message: "Token not exist Please Login Again",
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const now = Math.floor(Date.now() / 1000); // Current time in seconds

//         if (decoded.exp < now) {
//             return res.status(401).json({
//                 status: "error",
//                 message: "Token has expired. Please log in again",
//             });
//         }

//         const currentUser = await User.findById(decoded.userId);
//         if (!currentUser) {
//             return res.status(403).json({
//                 status: "error",
//                 message: "User no longer exists with this token. Please log in again.",
//             });
//         }

//         if (currentUser.changedPasswordAfter(decoded.iat)) {
//             return res.status(401).json({
//                 status: "error",
//                 message: "User recently changed password! Please log in again.",
//             });
//         }
//         req.user = currentUser;
//         req.userId = currentUser.id;
//         next();
//     } catch (error) {
//         return res.status(403).json({
//             status: "error",
//             message: error.message || "Invalid token. Please log in again.",
//         });
//     }
// };
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.refreshToken) {
            token = req.cookies.refreshToken;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(403).json({
                status: "error",
                message: "Token not exist Please Login Again"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            return res.status(401).json({
                status: "error",
                message: "Token has expired. Please log in again"
            });
        }
        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            return res.status(403).json({
                status: "error",
                message: "User no longer exists with this token. Please log in again."
            });
        }
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: "error",
                message: "User recently changed password! Please log in again."
            });
        }
        req.user = currentUser;
        req.userId = currentUser.id;
        next();
    } catch (error) {
        return res.status(403).json({
            status: "error",
            message: error.message || "Invalid token. Please log in again."
        });
    }
};
export const logout = async (req, res, next) => {
    try {
        const tokenInCookies = req.cookies && req.cookies.refreshToken;
        const authHeader = req.headers.authorization;
        if (tokenInCookies) {
            res.clearCookie("refreshToken", { path: "/" });
            return res.status(200).json({
                status: "success",
                message: "Logged out successfully"
            });
        } else if (authHeader && authHeader.startsWith("Bearer ")) {
            return res.status(200).json({
                status: "success",
                message: "Logged out successfully. Please clear token on client-side."
            });
        } else {
            return res.status(401).json({
                status: "error",
                message: "No active session found"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Server error"
        });
    }
};
// export const logout = async (req, res, next) => {
//     try {
//         const token = req.cookies;
//         if (token) {
//             res.clearCookie("refreshToken", { path: "/" });
//             return res.status(200).json({
//                 status: "success",
//                 message: "Logged out successfully",
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: "error",
//             message: error.message || "Server error",
//         });
//     }
// };


