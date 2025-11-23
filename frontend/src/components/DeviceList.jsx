import DeviceCard from './DeviceCard';

const DeviceList = ({ devices, onEdit, onDelete }) => {
  if (devices.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Devices Found</h3>
        <p>Click "Add Device" to create your first device.</p>
      </div>
    );
  }

  return (
    <div className="device-list">
      {devices.map((device) => (
        <DeviceCard
          key={device._id}
          device={device}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeviceList;