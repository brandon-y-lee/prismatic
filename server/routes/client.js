import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  getSupplier,
  viewTransaction,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", viewTransaction);
router.post("/createTransaction", createTransaction);
router.put("/updateTransaction/:id", updateTransaction);
router.delete("/deleteTransaction/:id", deleteTransaction);

router.get("/getSupplier/:userId", getSupplier);
router.get("/geography", getGeography);

export default router;
