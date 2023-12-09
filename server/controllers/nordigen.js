import NordigenClient from "nordigen-node";
import axios from "axios";


export const generateToken = async (req, res) => {
  const client = new NordigenClient({
    secretId: process.env.NORDIGEN_ID,
    secretKey: process.env.NORDIGEN_KEY
  });

  try {
    const data = await client.generateToken();
    // Handle token storage or session management as needed
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getInstitutions = async (req, res) => {
  // Extract the token
  const accessToken = req.headers['authorization']?.split(' ')[1];

  console.log('Access token: ', accessToken);

  try {
    const response = await axios.get('https://bankaccountdata.gocardless.com/api/v2/institutions/?country=fr', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createRequisition = async (req, res) => {
  const { institution_id } = req.body;
  const accessToken = req.headers['authorization']?.split(' ')[1];

  try {
    const response = await axios.post('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
      redirect: 'http://www.localhost:3000/funds',
      institution_id,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const listAccounts = async (req, res) => {
  const { requisitionId } = req.query;
  const accessToken = req.headers['authorization']?.split(' ')[1];

  try {
    const response = await axios.get(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const listTransactions = async (req, res) => {
  const { accountId } = req.params;
  const accessToken = req.headers['authorization']?.split(' ')[1];

  try {
    const response = await axios.get(`https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};