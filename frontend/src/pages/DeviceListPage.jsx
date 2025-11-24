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
      setError('Could not load devices: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevice = async (formData) => {
    try {
      await apiClient.post('/devices', formData);
      setShowForm(false);
      fetchDevices(); // refresh list
    } catch (err) {
      setError('Could not create device: ' + err.message);
    }
  };

  const handleUpdateDevice = async (formData) => {
    try {
      await apiClient.put(`/devices/${editingDevice._id}`, formData);
      setEditingDevice(null);
      setShowForm(false);
      fetchDevices();
    } catch (err) {
      setError('Could not update device: ' + err.message);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Delete this device?')) {
      return;
    }

    try {
      await apiClient.delete(`/devices/${id}`);
      fetchDevices();
    } catch (err) {
      setError('Could not delete device: ' + err.message);
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
          <h3>{editingDevice ? 'Edit Device' : 'New Device'}</h3>
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