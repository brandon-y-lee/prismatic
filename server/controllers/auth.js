import User from "../models/User.js";
import UserAuth from "../models/UserAuth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, accounts: [] });

    const savedUser = await newUser.save();

    const newUserAuth = new UserAuth({ email, password, user: savedUser });

    const savedUserAuth = await newUserAuth.save();
    res.status(201).json({ savedUser, savedUserAuth });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userAuth = await UserAuth.findOne({ email: email });
    if (!userAuth || !userAuth.user ) return res.status(400).json({ msg: "UserAuth or User does not exist." });

    console.log('Password: ', password);
    console.log('Auth Password: ', userAuth.password);
    
    const isMatch = await bcrypt.compare(password, userAuth.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    console.log('authId: ', userAuth._id);
    console.log('userId: ', userAuth.user._id);

    const token = jwt.sign({ id: userAuth._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { authId: userAuth._id, userId: userAuth.user._id }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  // Logout is often handled client-side; this is a placeholder.
  res.status(200).json({ message: "Logout successful" });
};