import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

UserAuthSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const UserAuth = mongoose.model('UserAuth', UserAuthSchema);

export default UserAuth;