import { Router } from "express";
import { AddBalanceforUser, AdminResetPassword, blockUser, closeAccount, createBank, createBankAccount, CreateBillerData, CreateTelecomData, createTransactionByAdmin, createUserByAdmin, deleteBank, DeleteBillerData, DeleteDuplicateIndex, DeleteTelecomData, deleteTransactionHistoryById, deleteUserById, EditUserByAdmin, getAdminData, getAllBanks, GetAllBillers, GetAllTelecom, getAllUser, getDashboardStats, GetDuplicateIndex, getSingleUser, getTransactionHistoryOFAdminByUser, isAdmin, loginAdmin, reopenAccount, sendEmailsToMultipleUsers, unBlockUser, updateBank, UpdateBillerData, UpdateTelecomData } from "../Controller/AdminController.js";
import { protect } from "../Controller/AuthController.js";
import { sendPromotionToMultipleUsers, upload } from "../Controller/PromotionController.js";


const router = Router();
router.post('/login-admin', loginAdmin);

router.put('/block-user/:userId', protect, isAdmin, blockUser);
router.put('/unblock-user/:userId', protect, isAdmin, unBlockUser);
router.get('/get-single-user/:id', protect, isAdmin, getSingleUser);
router.get('/get-all-user', protect, isAdmin, getAllUser);
router.post('/admin-password-reset', protect, isAdmin, AdminResetPassword);

router.post('/create-transaction-byAdmin', protect, isAdmin, createTransactionByAdmin);
router.post('/create-bank-account/:userId', protect, isAdmin, createBankAccount);
router.get('/get-admin-stats', protect, isAdmin, getDashboardStats);
router.delete('/delete-user-By-id/:userId', protect, isAdmin, deleteUserById);
router.post('/create-user-byAdmin', protect, isAdmin, createUserByAdmin);
router.get('/get-transaction-history-of-user/:userId', protect, isAdmin, getTransactionHistoryOFAdminByUser);
router.delete('/delete-transaction', protect, isAdmin, deleteTransactionHistoryById);
router.get('/get-admin-data', protect, isAdmin, getAdminData);

router.get('/get-duplicate-db-index', protect, isAdmin, GetDuplicateIndex);
router.delete('/delete-dublicate-db-index', protect, isAdmin, DeleteDuplicateIndex);

router.post('/add-user-balance/:userId', protect, isAdmin, AddBalanceforUser);

router.put('/edit-user-by-admin/:userId', protect, isAdmin, EditUserByAdmin);

//Billers
router.post('/create-billers', protect, isAdmin, CreateBillerData);
router.put('/update-biller/:id', protect, isAdmin, UpdateBillerData);
router.delete('/delete-billers/:id', protect, isAdmin, DeleteBillerData);
router.get('/get-billers', protect, GetAllBillers)

//Telecom
router.post('/create-telecom', protect, isAdmin, CreateTelecomData);
router.put('/update-telecom/:id', protect, isAdmin, UpdateTelecomData);
router.delete('/delete-telecom/:id', protect, isAdmin, DeleteTelecomData);
router.get('/get-telecom', protect, GetAllTelecom);

router.post('/account-close/:userId', protect, isAdmin, closeAccount);
router.post('/account-reopen/:userId', protect, reopenAccount);
router.post('/send-bulk-email',protect,isAdmin,sendEmailsToMultipleUsers);

//Bank

router.get('/get-bank-details', protect,getAllBanks);
router.post('/create-bank',protect,isAdmin,createBank);
router.put('/update-bank/:id',protect,isAdmin,updateBank);
router.delete('/delete-bank/:id',protect,isAdmin,deleteBank);
router.post('/send-promo-email',protect,isAdmin,upload,sendPromotionToMultipleUsers);

export default router;