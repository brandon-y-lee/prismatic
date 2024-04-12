import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const InviteSchema = new Schema({
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ignored'],
      default: 'pending'
    },
    request_date: {
      type: Date,
      default: Date.now
    }
});

/* make sure that combination of sender and recipient is unique */
InviteSchema.index({ sender: 1, recipient: 1 }, { unique: true });

const Invite = mongoose.model('Invite', InviteSchema);
export default Invite;