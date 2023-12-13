import express from 'express';
import { exchangePublicTokenForAccessToken, getAccounts, getLinkToken, getTransactions } from '../controllers/plaid.js';

const router = express.Router();

router.post('/get-link-token', getLinkToken);
router.post('/exchange-public-token', exchangePublicTokenForAccessToken);
router.post('/get-accounts', getAccounts);
router.post('/get-transactions', getTransactions);

export default router;
