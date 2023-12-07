import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import UserAuth from "../models/UserAuth.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";


export const getTransactions = async (req, res) => {
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
      $or: [{ buyerId: userId }, { sellerId: userId }],
    };

    const transactions = await Transaction.find(query)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    
    if (!transactions) {
      return res.status(404).json({ message: 'Transactions not found.' });
    }

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { buyerId, sellerId, products, cost, initialDate, expiryDate } = req.body;

    const newTransaction = new Transaction({
      buyerId,
      sellerId,
      cost,
      initialDate,
      expiryDate,
    });

    await newTransaction.save();

    const productDocuments = await Promise.all(products.map(async (productData) => {
      const product = new Product({ ...productData, totalCost: (productData.price * productData.quantity), transactionId: newTransaction._id });
      await product.save();
      return product;
    }));

    newTransaction.products = productDocuments.map(product => product._id);
    await newTransaction.save();
    
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

export const viewTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id).populate('products');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSupplier = async (req, res) => {
  try {
    console.log("Getting User: ", req.params);
    const { userId } = req.params;

    const userAuth = await UserAuth.findById(userId);

    if (!userAuth) {
      return res.status(404).json({ message: 'User Auth not found.' });
    }
    
    console.log('User Auth: ', userAuth);
    const user = await User.findById(userAuth.user);
    
    if (!user)
      return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, cost } = req.body;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    transaction.cost = cost;

    const updatedProductIds = await Promise.all(products.map(async (product) => {
      const totalCost = product.price * product.quantity;

      if (product._id) {
        await Product.findByIdAndUpdate(product._id, { ...product, totalCost });
        return product._id;
      } else {
        const newProduct = new Product({ ...product, totalCost, transactionId: id });
        await newProduct.save();
        return newProduct._id;
      }
    }));

    const existingProductIds = transaction.products.map(prod => prod.toString());
    const productsToDelete = existingProductIds.filter(prodId => !updatedProductIds.includes(prodId));
    await Product.deleteMany({ _id: { $in: productsToDelete } });

    transaction.products = updatedProductIds;
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    await Product.deleteMany({ transactionId: id });
    await Transaction.deleteOne({ _id: id });

    res.status(200).json({ message: 'Transaction and associated products deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};







export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};