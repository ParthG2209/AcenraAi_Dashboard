import { useNavigate } from 'react-router-dom';

const DeviceCard = ({ device, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status) => {
    return status === 'online' ? 'status-online' : 'status-offline';
  };

  return (
    <div className="device-card">
      <div className="device-card-header">
        <h3>{device.name}</h3>
        <span className={`status-badge ${getStatusClass(device.status)}`}>
          {device.status}
        </span>
      </div>
      
      <div className="device-card-body">
        <p>
          <strong>Location:</strong> {device.location}
        </p>
        <p>
          <strong>Last Seen:</strong> {formatDate(device.lastSeen)}
        </p>
      </div>
      
      <div className="device-card-actions">
        <button
          onClick={() => navigate(`/devices/${device._id}`)}
          className="btn btn-info btn-sm"
        >
          Details
        </button>
        <button
          onClick={() => onEdit(device)}
          className="btn btn-primary btn-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(device._id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;