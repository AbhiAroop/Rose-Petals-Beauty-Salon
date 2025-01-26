import React, { useState, useEffect } from 'react';

const AdminNewBookingModal = ({ isOpen, onClose, initialDateTime, onSubmit }) => {
  const defaultFormData = {
    fullName: '',
    phone: '',
    selectedServices: [],
    appointmentTime: initialDateTime || new Date()
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [services, setServices] = useState([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(defaultFormData);
    }
  }, [isOpen, initialDateTime]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(defaultFormData);
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-booking-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Appointment</h2>
          <span className="close-icon" onClick={handleClose}>×</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Client Details</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div className="form-section">
            <h3>Select Services</h3>
            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service.ServiceID}
                  className={`service-card ${
                    formData.selectedServices.includes(service) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    const updated = formData.selectedServices.includes(service)
                      ? formData.selectedServices.filter(s => s.ServiceID !== service.ServiceID)
                      : [...formData.selectedServices, service];
                    setFormData({...formData, selectedServices: updated});
                  }}
                >
                  <h4>{service.ServiceName}</h4>
                  <p>${service.Price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Appointment Time</h3>
            <input
              type="datetime-local"
              value={formData.appointmentTime}
              onChange={e => setFormData({...formData, appointmentTime: e.target.value})}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={handleClose}>Cancel</button>
            <button type="submit">Create Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewBookingModal;