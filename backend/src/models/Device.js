const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Device needs a name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Device needs a location'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Device needs a status'],
      enum: {
        values: ['online', 'offline'],
        message: 'Status must be online or offline',
      },
    },
    lastSeen: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// add indexes for faster queries
deviceSchema.index({ status: 1 });
deviceSchema.index({ lastSeen: -1 });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;