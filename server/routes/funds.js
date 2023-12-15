import express from "express";
import { 
  createFund, 
  createInvoice, 
  deleteFund, 
  deleteInvoice, 
  getFunds, 
  getUserRepaymentDetails, 
  updateFund, 
  updateInvoice, 
  viewInvoice 
} from "../controllers/funds.js";

const router = express.Router();

// Invoice routes
router.post('/invoice', createInvoice);
router.get('/invoice/:id', viewInvoice);
router.put('/updateInvoice/:id', updateInvoice);
router.delete('/invoice/:id', deleteInvoice);

// Fund routes
router.post('/get-funds', getFunds);
router.post('/create-fund', createFund);
router.put('/updateFund/:id', updateFund);
router.delete('/fund/:id', deleteFund);

router.get('/get-user-repayment-details', getUserRepaymentDetails);

export default router;
