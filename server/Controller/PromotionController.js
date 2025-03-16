import ImageKit from "imagekit";
import multer from "multer";
import dotenv from "dotenv";
import User from "../Model/UserModel.js";
import ImageModel from "../Model/ImageModel.js";
import sendMail from "../Utils/Mailer.js";
import {PromotionalAdds} from "../Templates/Promotion.js";
import mongoose from "mongoose";

dotenv.config();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("image");

const getUsersByIds = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) {
      throw new Error('userIds must be an array');
    }

    // Filter valid ObjectId strings
    const validIds = userIds
      .filter(id => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id))
      .map(id => new mongoose.Types.ObjectId(id));  // ✅ FIX: Use `new`

    if (validIds.length === 0) {
      throw new Error('No valid user IDs provided');
    }

    // Fetch users
    const users = await User.find({ '_id': { $in: validIds } }).select('email');
    return users;
  } catch (error) {
    console.error('Error fetching users by IDs:', error);
    throw error;
  }
};

export const sendPromotionToMultipleUsers = async (req, res) => {
  try {
    console.log('req.body in controller:', req.body);
    console.log('req.file in controller:', req.file); 

    const { selectedUsers, sub } = req.body;

    // Step 1: Validate selected users
    if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) {
      return res.status(400).json({ status: "error", message: "No users selected." });
    }

    // Step 2: Fetch valid users by IDs using the getUsersByIds function
    const users = await getUsersByIds(selectedUsers);

    if (users.length === 0) {
      return res.status(400).json({ status: "error", message: "No valid users found." });
    }

    // Step 3: Validate image file upload
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No file uploaded." });
    }

    // Step 4: Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `promo-${Date.now()}-${req.file.originalname}`,
      folder: "/promotions",
    });

    // Step 5: Save the image URL to DB (optional, since you might want to store it for later)
    await new ImageModel({ imageUrl: uploadedImage.url }).save();

    // Step 6: Prepare the email content
    const sentEmails = [];

    // Step 7: Loop through users and send promotional emails
    for (let user of users) {
      const emailData = {
        recipient: user.email,
        sender: process.env.MAIL_ID,
        subject: sub,
        html: PromotionalAdds(uploadedImage.url),  // Use the uploaded image URL in the email body
      };

      try {
        await sendMail(emailData);
        sentEmails.push(user.email);
        console.log(`Email sent successfully to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error.message);
      }
    }

    // Step 8: Return the success response
    return res.status(200).json({
      status: "success",
      message: `Promotions sent successfully to: ${sentEmails.join(", ")}`,
      imageUrl: uploadedImage.url,  // Include the uploaded image URL in the response
    });

  } catch (error) {
    console.error("Promotion Error:", error);
    return res.status(500).json({ status: "error", message: "Failed to send promotions." });
  }
};
