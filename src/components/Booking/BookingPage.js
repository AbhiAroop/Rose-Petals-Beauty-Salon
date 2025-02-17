import React, { useState } from 'react';
import ClientInfoForm from './ClientInfoForm';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingSummary from './BookingSummary';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    selectedServices: [],
    appointmentTime: null
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://rose-petals-backend.vercel.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <ClientInfoForm 
                 data={bookingData} 
                 setData={setBookingData} 
                 onNext={nextStep} 
               />;
      case 2:
        return <ServiceSelection 
                 data={bookingData} 
                 setData={setBookingData} 
                 onNext={nextStep}
                 onBack={prevStep}
               />;
      case 3:
        return <TimeSelection 
                 data={bookingData} 
                 setData={setBookingData} 
                 onNext={nextStep}
                 onBack={prevStep}
               />;
      case 4:
        return <BookingSummary 
                 data={bookingData}
                 onConfirm={handleSubmit}
                 onBack={prevStep}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
        <div className="booking-container">
            <h2 className="booking-title">Book an Appointment</h2>
            <div className="booking-progress">
                <div className="progress-steps">
                    {[1, 2, 3, 4].map(num => (
                        <div 
                            key={num} 
                            className={`step ${num === step ? 'active' : ''} 
                                      ${num < step ? 'completed' : ''}`}
                        >
                            <div className="step-number">{num}</div>
                            <div className="step-label">
                                {num === 1 && 'Your Info'}
                                {num === 2 && 'Services'}
                                {num === 3 && 'Time'}
                                {num === 4 && 'Summary'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="booking-content">
                {renderStep()}
            </div>
        </div>
    </div>
);};

export default BookingPage;