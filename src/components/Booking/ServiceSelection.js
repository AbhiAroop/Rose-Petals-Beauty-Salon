import React, { useState, useEffect } from 'react';

const ServiceSelection = ({ data, setData, onNext, onBack }) => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);  // Add error state

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://rose-petals-backend.vercel.app/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch services');
        }
    
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid service data received');
        }
    
        setServices(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err.message);
      }
    };
    fetchServices();
  }, []);

  const toggleService = (service) => {
    const isSelected = data.selectedServices.some(s => s.ServiceID === service.ServiceID);
    if (isSelected) {
      setData({
        ...data,
        selectedServices: data.selectedServices.filter(s => s.ServiceID !== service.ServiceID)
      });
    } else {
      setData({
        ...data,
        selectedServices: [...data.selectedServices, service]
      });
    }
  };

   return (
    <div className="booking-step">
      <h3>Select Services</h3>
      
      {/* Add error message display */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Show loading state or services */}
      {!error && services.length === 0 ? (
        <div className="loading">Loading services...</div>
      ) : (
        <div className="service-grid">
          {services.map(service => (
            <div
              key={service.ServiceID}
              className={`service-card ${
                data.selectedServices.some(s => s.ServiceID === service.ServiceID) ? 'selected' : ''
              }`}
              onClick={() => toggleService(service)}
            >
              <h4>{service.ServiceName}</h4>
              <p>{service.Description}</p>
              <p className="price">${service.Price}</p>
              <p className="duration">{service.Duration} mins</p>
            </div>
          ))}
        </div>
      )}

      <div className="booking-buttons">
        <button onClick={onBack} className="booking-button back">
          Back
        </button>
        <button 
          onClick={onNext}
          disabled={!data.selectedServices.length}
          className="booking-button next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;