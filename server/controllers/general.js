import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import { TransactionStatus } from "../configs/TransactionStatus.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    console.log("Finding Dashboard Stats with User Id: ", req.query);
    const { userId } = req.query;

    if (!userId || userId === "null") {
      return res.status(400).json({ message: "UserId is missing" });
    }

    /* Active Transactions */
    const activeTransactions = await Transaction.countDocuments({
      $or: [{ buyerId: userId }, { sellerId: userId }],
      status: { 
        $in: [
          TransactionStatus.NEW_ORDER, 
          TransactionStatus.PROCESSING, 
          TransactionStatus.EN_ROUTE
        ]
      }
    });

    console.log('Active Transactions: ', activeTransactions);

    res.status(200).json({ activeTransactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
