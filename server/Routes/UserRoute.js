import { Router } from "express";
import { protect } from "../Controller/AuthController.js";
import { checkAccountCreeation, createBankAcountByUser, createTransaction, getBankAccountDetails, getTransactionHistory, getTransactionHistoryByID, getUserData, getUserDataById, requestAccountClosure, requestAccountReopening, updateProfileUser } from "../Controller/UserBankController.js";




const router = Router();

router.post('/create-bank-account',protect,createBankAcountByUser);
// router.post('/create-internal-bank-transaction',protect,createInternalTransaction);
// router.post('/create-extrernal-bank-transaction',protect,createExternalTransaction);
router.get('/get-history-transaction',protect,getTransactionHistory);
router.get('/get-bank-details',protect,getBankAccountDetails);
router.get('/get-user-data',protect,getUserData);
router.get('/check-account-creation',protect,checkAccountCreeation);
router.post('/create-transactions',protect,createTransaction);
router.get('/get-user-data-ById/:userId',protect,getUserDataById);
router.post('/account-close-request',protect,requestAccountClosure);
router.post('/request-account-reopen',protect,requestAccountReopening);
router.put('/update-user-profile',protect,updateProfileUser);

router.get('/get-single-transaction-detail/:transactionId',protect,getTransactionHistoryByID);


export default router;