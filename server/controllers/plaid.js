import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import UserAuth from '../models/UserAuth.js';
import User from '../models/User.js';
import Account from '../models/Account.js';
import dotenv from "dotenv";

dotenv.config();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

export const getLinkToken = async (req, res) => {
  const { authId } = req.body;

  try {
    const configs = {
      user: {
        client_user_id: authId,
      },
      client_name: 'Plaid Quickstart',
      products: (process.env.PLAID_PRODUCTS || 'transactions').split(','),
      country_codes: (process.env.PLAID_COUNTRY_CODES || 'US').split(','),
      language: 'en',
    };

    const createTokenResponse = await client.linkTokenCreate(configs);
    res.status(200).json(createTokenResponse.data);
  } catch (error) {
    console.error('Error creating link token:', error);
  }
};

export const exchangePublicTokenForAccessToken = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { public_token, authId } = req.body;
    const tokenResponse = await client.itemPublicTokenExchange({ public_token });
    const accessToken = tokenResponse.data.access_token;

    await UserAuth.updateOne({ _id: authId }, { accessToken: accessToken });

    res.status(200).json({ message: "Access Token exchanged and stored successfully" });
  } catch (error) {
    console.error('Error exchanging public token:', error);
  }
};

export const getAccounts = async (req, res) => {
  console.log('Request body:', req.body);
  const { authId, userId } = req.body;

  try {
    const userAuth = await UserAuth.findById(authId);
    const accessToken = userAuth.accessToken;

    if (!accessToken) {
      return res.status(404).json({ message: 'Access Token not found.' });
    }

    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });

    console.log('accountsResponse: ', accountsResponse);

    const user = await User.findById(userId).populate('accounts');

    const accountPromises = accountsResponse.data.accounts.map( async (accountInfo) => {
      const accountExists = user.accounts.some(acc => acc.accountId === accountInfo.account_id);

      if (!accountExists) {
        const newAccount = new Account({
          accountId: accountInfo.account_id,
        });
        await newAccount.save();

        user.accounts.push(newAccount);
      }
    });

    await Promise.all(accountPromises);

    await user.save();
    
    console.log('Accounts updated:', accountsResponse.data);
    res.status(200).json(accountsResponse.data);
  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { authId } = req.body;

  const userAuth = await UserAuth.findById(authId);
  const accessToken = userAuth.accessToken;
  
  if (!accessToken) {
    return res.status(404).json({ message: 'Access Token not found.' });
  }

  const request = {
    access_token: accessToken,
    start_date: '2023-01-01',
    end_date: '2023-10-01'
  };

  try {
    const response = await client.transactionsGet(request);
    console.log('response: ', response.data.transactions);

    let transactions = response.data.transactions;
    const total_transactions = response.data.total_transactions;

    while (transactions.length < total_transactions) {
      const paginatedRequest = {
        access_token: accessToken,
        start_date: '2023-01-01',
        end_date: '2023-10-01',
        options: {
          offset: 0,
        },
      };
      const paginatedResponse = await client.transactionsGet(paginatedRequest);
      console.log('paginated response: ', paginatedResponse.data.transactions);
      transactions = transactions.concat(
        paginatedResponse.data.transactions,
      );
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: error.message });
  }
};