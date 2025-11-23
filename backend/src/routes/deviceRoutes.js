const express = require('express');
const router = express.Router();
const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceExternalInfo,
} = require('../controllers/deviceController');

// Device CRUD routes
router.route('/')
  .get(getAllDevices)
  .post(createDevice);

router.route('/:id')
  .get(getDeviceById)
  .put(updateDevice)
  .delete(deleteDevice);

// External lookup route (Tavily integration)
router.get('/:id/external', getDeviceExternalInfo);

module.exports = router;