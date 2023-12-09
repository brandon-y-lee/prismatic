import express from 'express';
import { createRequisition, generateToken, getInstitutions, listAccounts, listTransactions } from '../controllers/nordigen.js';

const router = express.Router();

router.get('/token', generateToken);
router.get('/institutions', getInstitutions);
router.get('/list-accounts', listAccounts);
router.get('/accounts/:accountId/transactions', listTransactions);


router.post('/create-requisition', createRequisition);

export default router;
