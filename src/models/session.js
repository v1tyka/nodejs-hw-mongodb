import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: [true, 'User ID is required'],
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is required'],
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required'],
    },
    accessTokenValidUntil: {
      type: Date,
      required: [true, 'Access token expiry date is required'],
    },
    refreshTokenValidUntil: {
      type: Date,
      required: [true, 'Refresh token expiry date is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false,
  }
);

export const Session = model('Session', sessionSchema);
