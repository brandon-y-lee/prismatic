import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import UserAuth from '../models/UserAuth.js';
import dotenv from "dotenv";

dotenv.config();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

console.log('Plaid Client ID:', PLAID_CLIENT_ID);
console.log('Plaid Secret:', PLAID_SECRET);

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
  const { userId } = req.body;

  try {
    const configs = {
      user: {
        client_user_id: userId,
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
    const { public_token, userId } = req.body;
    const tokenResponse = await client.itemPublicTokenExchange({ public_token });
    const accessToken = tokenResponse.data.access_token;

    await UserAuth.updateOne({ id: userId }, { accessToken: accessToken });

    res.status(200).json({ message: "Access Token exchanged and stored successfully" });
  } catch (error) {
    console.error('Error exchanging public token:', error);
  }
};

export const getAccounts = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserAuth.findById(userId);
    const accessToken = user.accessToken;
    if (!accessToken) {
      return res.status(404).json({ message: 'Access Token not found.' });
    }

    const accountsResponse = await client.accountsGet({
      access_token: accessToken,
    });

    console.log('Accounts response:', accountsResponse.data);
    res.status(200).json(accountsResponse.data);
  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { userId } = req.body;

  const user = await UserAuth.findById(userId);
  const accessToken = user.accessToken;
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