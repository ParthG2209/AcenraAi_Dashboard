const Device = require('../models/Device');
const { searchTavily, formatTavilyResponse } = require('../services/tavilyService');

const getAllDevices = async (req, res, next) => {
  try {
    console.log('Getting all devices...');
    const devices = await Device.find().sort({ lastSeen: -1 });
    console.log(`Found ${devices.length} devices`);
    
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    next(error);
  }
};

const getDeviceById = async (req, res, next) => {
  try {
    console.log(`Looking for device: ${req.params.id}`);
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      console.log('Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('Device found:', device.name);
    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('Error getting device:', error);
    // bad id format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    next(error);
  }
};

const createDevice = async (req, res, next) => {
  try {
    const { name, location, status, lastSeen } = req.body;
    
    console.log('Creating device:', { name, location, status });
    
    if (!name || !location || !status) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Need name, location, and status',
      });
    }
    
    const device = await Device.create({
      name,
      location,
      status,
      lastSeen: lastSeen || Date.now(),
    });
    
    console.log('Device created!');
    console.log('ID:', device._id);
    console.log('Name:', device.name);
    
    res.status(201).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('Error creating device:', error);
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

const updateDevice = async (req, res, next) => {
  try {
    const { name, location, status, lastSeen } = req.body;
    
    console.log(`Updating device: ${req.params.id}`);
    
    // only update what was provided
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    if (lastSeen) updateData.lastSeen = lastSeen;
    
    console.log('Update data:', updateData);
    
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // return updated doc
        runValidators: true,
      }
    );
    
    if (!device) {
      console.log('Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('Device updated');
    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error('Error updating device:', error);
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

const deleteDevice = async (req, res, next) => {
  try {
    console.log(`Deleting device: ${req.params.id}`);
    const device = await Device.findByIdAndDelete(req.params.id);
    
    if (!device) {
      console.log('Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log('Device deleted:', device.name);
    res.status(200).json({
      success: true,
      data: {},
      message: 'Device deleted',
    });
  } catch (error) {
    console.error('Error deleting device:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    next(error);
  }
};

// search for device info online using Tavily
const getDeviceExternalInfo = async (req, res, next) => {
  try {
    console.log(`Getting external info for: ${req.params.id}`);
    
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      console.log('Device not found');
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    
    console.log(`Searching Tavily for: ${device.name}`);
    
    // just search for device name + "latest status"
    const query = `${device.name} latest status`;
    
    const tavilyData = await searchTavily(query);
    
    const formattedResponse = formatTavilyResponse(tavilyData, device._id, query);
    
    console.log('Got external info');
    res.status(200).json({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    console.error('Error getting external info:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get external info',
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