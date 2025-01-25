import React, { useState, useEffect } from 'react';

const ServiceSelection = ({ data, setData, onNext, onBack }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
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
            <p>{service.ServiceDesc}</p>
            <p className="price">${service.Price}</p>
          </div>
        ))}
      </div>
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