const Device = require('../models/Device');
const { searchTavily, formatTavilyResponse } = require('../services/tavilyService');

/**
 * @desc    Get all devices
 * @route   GET /devices
 * @access  Public (should be protected in production)
 */
const getAllDevices = async (req, res, next) => {
  try {
    console.log('📋 Fetching all devices from database...');
    const devices = await Device.find().sort({ lastSeen: -1 });
    console.log(`✅ Found ${devices.length} devices`);
    
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    console.error('❌ Error fetching devices:', error);
    next(error);
  }
};

/**
 * @desc    Get single device by ID
 * @route   GET /devices/:id
 * @access  Public (should be protected in production)
 */
const getDeviceById = async (req, res, next) => {
  try {
    console.log(`🔍 Fetching device with ID: ${req.params.id}`);
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      console.log('❌ Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('✅ Device found:', device.name);
    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('❌ Error fetching device:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    next(error);
  }
};

/**
 * @desc    Create new device
 * @route   POST /devices
 * @access  Public (should be protected in production)
 */
const createDevice = async (req, res, next) => {
  try {
    const { name, location, status, lastSeen } = req.body;
    
    console.log('📝 Creating new device with data:', { name, location, status, lastSeen });
    
    // Validate required fields
    if (!name || !location || !status) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Please provide name, location, and status',
      });
    }
    
    // Create device with optional lastSeen or default to now
    const device = await Device.create({
      name,
      location,
      status,
      lastSeen: lastSeen || Date.now(),
    });
    
    console.log('✅ Device created successfully!');
    console.log('   ID:', device._id);
    console.log('   Name:', device.name);
    console.log('   Location:', device.location);
    console.log('   Status:', device.status);
    
    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('❌ Error creating device:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    next(error);
  }
};

/**
 * @desc    Update device
 * @route   PUT /devices/:id
 * @access  Public (should be protected in production)
 */
const updateDevice = async (req, res, next) => {
  try {
    const { name, location, status, lastSeen } = req.body;
    
    console.log(`✏️ Updating device ID: ${req.params.id}`);
    
    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    if (lastSeen) updateData.lastSeen = lastSeen;
    
    console.log('   Update data:', updateData);
    
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );
    
    if (!device) {
      console.log('❌ Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('✅ Device updated successfully');
    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('❌ Error updating device:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete device
 * @route   DELETE /devices/:id
 * @access  Public (should be protected in production)
 */
const deleteDevice = async (req, res, next) => {
  try {
    console.log(`🗑️ Deleting device ID: ${req.params.id}`);
    const device = await Device.findByIdAndDelete(req.params.id);
    
    if (!device) {
      console.log('❌ Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('✅ Device deleted successfully:', device.name);
    res.status(200).json({
      success: true,
      data: {},
      message: 'Device deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting device:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    next(error);
  }
};

/**
 * @desc    Get external device information via Tavily Search API
 * @route   GET /devices/:id/external
 * @access  Public (should be protected in production)
 */
const getDeviceExternalInfo = async (req, res, next) => {
  try {
    console.log(`🔎 Fetching external info for device ID: ${req.params.id}`);
    
    // 1. Look up device by ID
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      console.log('❌ Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log(`🌐 Searching Tavily for: ${device.name}`);
    
    // 2. Construct Tavily search query
    const query = `${device.name} latest status`;
    
    // 3. Call Tavily Search API
    const tavilyData = await searchTavily(query);
    
    // 4. Format and return response
    const formattedResponse = formatTavilyResponse(tavilyData, device._id, query);
    
    console.log('✅ External info fetched successfully');
    res.status(200).json({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    console.error('❌ Error fetching external info:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    // Return clear error message for Tavily failures
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch external information',
    });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceExternalInfo,
};