import React, { useState } from 'react';
import ClientInfoForm from './ClientInfoForm';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingSummary from './BookingSummary';

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
      const response = await fetch('http://localhost:3001/api/bookings', {
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
    <div className="booking-container">
      <h2>Book an Appointment</h2>
      <div className="booking-progress">
        Step {step} of 4
      </div>
      {renderStep()}
    </div>
  );
};

export default BookingPage;