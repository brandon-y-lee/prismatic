import User from "../models/User.js";
import UserAuth from "../models/UserAuth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email });

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

    const user = await UserAuth.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    console.log('Password: ', password);
    console.log('Auth Password: ', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  // Logout is often handled client-side; this is a placeholder.
  res.status(200).json({ message: "Logout successful" });
};