import express from "express";
import { 
  createFund, 
  createInvoice, 
  deleteFund, 
  deleteInvoice, 
  getFunds, 
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
router.post('/fund', createFund);
router.get('/fund/:id', getFunds);
router.put('/updateFund/:id', updateFund);
router.delete('/fund/:id', deleteFund);

export default router;
