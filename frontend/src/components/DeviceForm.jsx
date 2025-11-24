import { useState, useEffect } from 'react';

const DeviceForm = ({ device, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'online',
    lastSeen: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (device) {
      // editing existing device
      setFormData({
        name: device.name || '',
        location: device.location || '',
        status: device.status || 'online',
        lastSeen: device.lastSeen
          ? new Date(device.lastSeen).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } else {
      // new device - reset form
      setFormData({
        name: '',
        location: '',
        status: 'online',
        lastSeen: new Date().toISOString().slice(0, 16),
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="device-form">
      <div className="form-group">
        <label htmlFor="name">Device Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Server #1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="e.g. Data Center A"
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status *</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="lastSeen">Last Seen *</label>
        <input
          type="datetime-local"
          id="lastSeen"
          name="lastSeen"
          value={formData.lastSeen}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {device ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DeviceForm;