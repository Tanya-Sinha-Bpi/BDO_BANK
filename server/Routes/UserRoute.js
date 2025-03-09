import { Router } from "express";
import { protect } from "../Controller/AuthController.js";
import { checkAccountCreeation, createBankAcountByUser, createTransaction, getBankAccountDetails, getTransactionHistory, getUserData } from "../Controller/UserBankController.js";



const router = Router();

router.post('/create-bank-account',protect,createBankAcountByUser);
// router.post('/create-internal-bank-transaction',protect,createInternalTransaction);
// router.post('/create-extrernal-bank-transaction',protect,createExternalTransaction);
router.get('/get-history-transaction',protect,getTransactionHistory);
router.get('/get-bank-details',protect,getBankAccountDetails);
router.get('/get-user-data',protect,getUserData);
router.get('/check-account-creation',protect,checkAccountCreeation);
router.post('/create-transactions',protect,createTransaction);


export default router;