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
  uploadFile,
} from "../controllers/client.js";
import multer from 'multer';

// Set up the multer s3 storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", viewTransaction);
router.post("/createTransaction", createTransaction);
router.put("/updateTransaction/:id", updateTransaction);
router.delete("/deleteTransaction/:id", deleteTransaction);

router.post("/uploadFile", upload.single('file'), uploadFile);

router.get("/getSupplier/:userId", getSupplier);
router.get("/geography", getGeography);

export default router;
