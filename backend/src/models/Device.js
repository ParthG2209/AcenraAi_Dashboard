const mongoose = require('mongoose');

/**
 * Device Schema for MongoDB
 * Represents IoT devices with status tracking
 */
const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Device location is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Device status is required'],
      enum: {
        values: ['online', 'offline'],
        message: '{VALUE} is not a valid status. Must be "online" or "offline"',
      },
    },
    lastSeen: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Index for faster queries
deviceSchema.index({ status: 1 });
deviceSchema.index({ lastSeen: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;