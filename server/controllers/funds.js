import Invoice from "../models/Invoice.js";
import Fund from "../models/Fund.js";
import axios from "axios";


/* GENERATE ID */
function generateId() {
  // Get current year
  const year = new Date().getFullYear();
  
  // Generate a 3-digit random number
  // This will generate a number between 100 and 999
  const randomDigits = Math.floor(Math.random() * 899) + 100;
  
  // Generate 2 random uppercase letters
  // This will generate a number between 65(A) and 90(Z)
  const randomChars = String.fromCharCode(
    65 + Math.floor(Math.random() * 26), 
    65 + Math.floor(Math.random() * 26)
  );
  
  // Concatenate the parts
  // e.g., PT2023756HS
  const id = 'PT' + year + randomDigits + randomChars;
  
  return id;
};

/* INVOICE - CRUD */
export const getInvoices = async (req, res) => {
  try {
    const { userId, page, pageSize, sort, search } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const query = {
      userId: userId
    };

    const invoices = await Invoice.find(query)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    
    if (!invoices) {
      return res.status(404).json({ message: 'Invoices not found.' });
    }

    res.status(200).json({
      invoices,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { userId, clientId, invoiceDate, invoiceTotal } = req.body;

    const newId = generateId();

    const newInvoice = new Invoice({
      id: newId,
      userId,
      clientId,
      invoiceDate,
      invoiceTotal
    });

    await newInvoice.save();
    
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

export const viewInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.find({ id: id });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceStatus, repaymentPlan } = req.body;

    const invoice = await Invoice.find({ id: id });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    if (invoiceStatus > 0) {
      invoice.invoiceStatus = invoiceStatus;
      const fund = new Fund({
        id: invoice.id,
        userId: invoice.userId,
        fundingDate: Date.now(),
        totalFunding: invoice.availableFunding,
        repaymentPlan: repaymentPlan
      })
      await fund.save();
    };

    await invoice.save();

    res.status(200).json(invoice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.find({ id: id });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    await Invoice.deleteOne({ id: id });

    res.status(200).json({ message: 'Invoice deleted successfully.' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};


/* FUND - CRUD */

export const getFunds = async (req, res) => {
  try {
    const { userId, page, pageSize, sort, search } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const query = { userId: userId };

    const funds = await Fund.find(query)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    
    if (!funds) {
      return res.status(404).json({ message: 'Funds not found.' });
    }

    res.status(200).json({ funds });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createFund = async (req, res) => {
  try {
    const { invoiceId, userId, totalFunding, repaymentPlan } = req.body;

    const newFund = new Fund({
      id: invoiceId,
      userId,
      totalFunding,
      repaymentPlan
    });

    await newFund.save();
    
    res.status(201).json(newFund);
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

export const viewFund = async (req, res) => {
  try {
    const { id } = req.params;

    const fund = await Fund.find({ id: id });

    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    res.status(200).json(fund);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const updateFund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid } = req.body;

    const fund = await Fund.find({ id: id });

    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    if (amountPaid) {
      fund.amountRepaid += amountPaid;
      fund.amountLeft = totalFunding - fund.amountRepaid
    };

    await fund.save();

    res.status(200).json(fund);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const deleteFund = async (req, res) => {
  try {
    const { id } = req.params;

    const fund = await Fund.find({ id: id });

    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    await Fund.deleteOne({ id: id });

    res.status(200).json({ message: 'Fund deleted successfully.' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};
