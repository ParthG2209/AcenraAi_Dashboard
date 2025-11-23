import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import TavilyResult from '../components/TavilyResult';

const DeviceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [tavilyData, setTavilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tavilyLoading, setTavilyLoading] = useState(false);
  const [error, setError] = useState('');
  const [tavilyError, setTavilyError] = useState('');

  useEffect(() => {
    fetchDevice();
  }, [id]);

  const fetchDevice = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get(`/devices/${id}`);
      setDevice(response.data.data);
    } catch (err) {
      setError('Failed to fetch device: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExternalInfo = async () => {
    try {
      setTavilyLoading(true);
      setTavilyError('');
      const response = await apiClient.get(`/devices/${id}/external`);
      setTavilyData(response.data.data);
    } catch (err) {
      setTavilyError(
        'Failed to fetch external information: ' +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setTavilyLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status) => {
    return status === 'online' ? 'status-online' : 'status-offline';
  };

  if (loading) {
    return <div className="loading">Loading device...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/devices')} className="btn btn-secondary">
          Back to Devices
        </button>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Device not found</div>
        <button onClick={() => navigate('/devices')} className="btn btn-secondary">
          Back to Devices
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Device Details</h2>
        <button onClick={() => navigate('/devices')} className="btn btn-secondary">
          Back to Devices
        </button>
      </div>

      <div className="device-detail">
        <div className="detail-card">
          <div className="detail-header">
            <h3>{device.name}</h3>
            <span className={`status-badge ${getStatusClass(device.status)}`}>
              {device.status}
            </span>
          </div>
          <div className="detail-body">
            <div className="detail-row">
              <strong>Location:</strong>
              <span>{device.location}</span>
            </div>
            <div className="detail-row">
              <strong>Last Seen:</strong>
              <span>{formatDate(device.lastSeen)}</span>
            </div>
            <div className="detail-row">
              <strong>Created:</strong>
              <span>{formatDate(device.createdAt)}</span>
            </div>
            <div className="detail-row">
              <strong>Updated:</strong>
              <span>{formatDate(device.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="external-lookup">
          <div className="lookup-header">
            <h3>External Device Lookup</h3>
            <button
              onClick={fetchExternalInfo}
              className="btn btn-primary"
              disabled={tavilyLoading}
            >
              {tavilyLoading ? 'Searching...' : 'Refresh External Info'}
            </button>
          </div>

          {tavilyError && (
            <div className="alert alert-error">{tavilyError}</div>
          )}

          {tavilyData && <TavilyResult data={tavilyData} />}

          {!tavilyData && !tavilyError && !tavilyLoading && (
            <p className="info-text">
              Click "Refresh External Info" to search for information about this
              device using Tavily Search API
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailPage;