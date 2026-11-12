import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
export default User;
