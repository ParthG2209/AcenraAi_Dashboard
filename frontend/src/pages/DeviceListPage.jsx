import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import DeviceList from '../components/DeviceList';
import DeviceForm from '../components/DeviceForm';

const DeviceListPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // Fetch devices on mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/devices');
      setDevices(response.data.data);
    } catch (err) {
      setError('Failed to fetch devices: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async (formData) => {
    try {
      await apiClient.post('/devices', formData);
      setShowForm(false);
      fetchDevices();
    } catch (err) {
      setError('Failed to create device: ' + err.message);
    }
  };

  const handleUpdateDevice = async (formData) => {
    try {
      await apiClient.put(`/devices/${editingDevice._id}`, formData);
      setEditingDevice(null);
      setShowForm(false);
      fetchDevices();
    } catch (err) {
      setError('Failed to update device: ' + err.message);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this device?')) {
      return;
    }

    try {
      await apiClient.delete(`/devices/${id}`);
      fetchDevices();
    } catch (err) {
      setError('Failed to delete device: ' + err.message);
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDevice(null);
  };

  if (loading) {
    return <div className="loading">Loading devices...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Device Management</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Add Device
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h3>{editingDevice ? 'Edit Device' : 'Create New Device'}</h3>
          <DeviceForm
            device={editingDevice}
            onSubmit={editingDevice ? handleUpdateDevice : handleCreateDevice}
            onCancel={handleCancel}
          />
        </div>
      )}

      <DeviceList
        devices={devices}
        onEdit={handleEdit}
        onDelete={handleDeleteDevice}
      />
    </div>
  );
};

export default DeviceListPage;