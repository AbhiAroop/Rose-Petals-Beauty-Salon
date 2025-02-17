import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookingSummary.css';

const BookingSummary = ({ data, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const totalPrice = data.selectedServices.reduce((sum, service) => sum + service.Price, 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format the data properly for the API
      const bookingData = {
        fullName: data.fullName,
        phone: data.phone,
        services: data.selectedServices.map(service => ({
          ServiceID: service.ServiceID,
          Price: service.Price
        })),
        appointmentTime: data.appointmentTime.toISOString()
      };

      const response = await fetch('https://rose-petals-backend.vercel.app/api/bookings/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      alert('Thank you! Your booking has been requested. You will receive a confirmation message once approved.');
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Failed to submit booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-step">
      <h3>Review Booking</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="summary-content">
        <div className="summary-section">
          <h4>Client Information</h4>
          <p><strong>Name:</strong> {data.fullName}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
        </div>

        <div className="summary-section">
          <h4>Selected Services</h4>
          {data.selectedServices.map(service => (
            <div key={service.ServiceID} className="service-item">
              <span>{service.ServiceName}</span>
              <span>${service.Price}</span>
            </div>
          ))}
          <div className="total-price">
            <strong>Total:</strong> ${totalPrice}
          </div>
        </div>

        <div className="summary-section">
          <h4>Appointment Time</h4>
          <p>{data.appointmentTime.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
      
      <div className="booking-buttons">
        <button 
          onClick={onBack} 
          className="booking-button back"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button 
          onClick={handleConfirm} 
          className="booking-button next"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;