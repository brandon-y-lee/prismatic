import Invoice from "../models/Invoice.js";
import Fund from "../models/Fund.js";
import UserAuth from "../models/UserAuth.js";
import User from "../models/User.js";
import { RepaymentPlan } from "../configs/RepaymentPlan.js";
import { addWeeks } from 'date-fns';



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
    const { accountIds } = req.body;
    let fundsData = {};

    for (const accountId of accountIds) {
      const funds = await Fund.find({ accountId: accountId });
      fundsData[accountId] = funds || [];
    }

    res.status(200).json(fundsData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createFund = async (req, res) => {
  const { invoiceAmount, accountId, invoiceId, userId, merchant, repaymentPlan } = req.body;

  try {
    const fundingDate = new Date().setHours(12, 0, 0, 0);
    const expiryDate = addWeeks(fundingDate, repaymentPlan);
    const nextPaymentDate = addWeeks(fundingDate, 1);

    const totalRepayment = parseFloat((invoiceAmount * 1.2).toFixed(2));
    const totalFee = parseFloat((totalRepayment - invoiceAmount).toFixed(2));
    const weeklyInstallment = parseFloat((totalRepayment / repaymentPlan).toFixed(2));

    const firstHalfFee = parseFloat(((totalFee * 0.75) / (repaymentPlan / 2)).toFixed(2));
    const weeklyFee = firstHalfFee;
    const weeklyPrincipal = parseFloat((weeklyInstallment - firstHalfFee).toFixed(2));

    const newFund = new Fund({
      userId,
      accountId,
      id: invoiceId,
      merchant,
      invoiceAmount,
      totalRepayment,
      totalFee,
      feePaid: 0,
      feeRemaining: totalFee,
      principalPaid: 0,
      principalRemaining: invoiceAmount,
      debitRemaining: totalRepayment,
      repaymentPlan,
      expiryDate,
      weeklyInstallment,
      weeklyPrincipal,
      weeklyFee,
      paymentsMade: 0,
      paymentsRemaining: repaymentPlan,
      nextPaymentAmount: weeklyInstallment,
      nextPaymentDate,
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

/* USER REPAYMENT - RU */

export const getUserRepaymentDetails = async (req, res) => {
  const { userId, selectedAccount } = req.query;

  try {
    const activeFunds = await Fund.find({ accountId: selectedAccount });
    if (!activeFunds) return res.status(404).json({ message: 'No active Funds found.' });
    console.log('activeFunds: ', activeFunds);

    const today = new Date();
    let ids = [];
    let nearestDate = new Date('9999-12-31');
    let totalAmount = 0;

    activeFunds.forEach((fund) => {
      if (fund.nextPaymentDate > today && fund.nextPaymentDate < nearestDate) {
        nearestDate = fund.nextPaymentDate;
        totalAmount = fund.weeklyInstallment;
        ids = [fund.id];
      } else if (fund.nextPaymentDate.getTime() === nearestDate.getTime()) {
        totalAmount += fund.weeklyInstallment;
        ids.push(fund.id);
      }
    });

    const userAuth = await UserAuth.findById(userId).populate('user');
    console.log('userAuth: ', userAuth);

    if (!userAuth || !userAuth.user) return res.status(404).json({ message: 'User not found.' });

    userAuth.user.nextRepaymentIds = ids;
    userAuth.user.nextRepaymentDate = nearestDate;
    userAuth.user.nextRepaymentAmount = totalAmount;

    await userAuth.user.save();

    res.status(200).json(userAuth.user);
  } catch (error) {
    console.error('Error updating user repayment info:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRepaymentDetails = async (req, res) => {
  const { fundId, nextPayment, nextRepaymentAmount } = req.body;

  try {
    const fund = await Fund.find({ id: fundId });
    if (!fund) return res.status(404).json({ message: 'No active Fund found.' });
    console.log('fund: ', fund);

    const userId = fund.userId;
    const userAuth = await UserAuth.findById(userId).populate('user');
    if (!userId || !userAuth.user) return res.status(404).json({ message: 'User not found.' });
    console.log('userAuth: ', userAuth);

    if (!userAuth.user.nextRepaymentIds.includes(fund.id))
      userAuth.user.nextRepaymentIds.push(fund.id);

    userAuth.user.nextRepaymentAmount = nextRepaymentAmount;
    fund.nextPayment = nextPayment;

    await userAuth.user.save();
    await fund.save();

    res.status(200).json({ fund });
  } catch (error) {
    console.error('Error updating user repayment info:', error);
    res.status(500).json({ message: error.message });
  }
};
