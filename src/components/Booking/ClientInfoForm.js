import React, { useState } from 'react';

const ClientInfoForm = ({ data, setData, onNext }) => {
  const [phoneError, setPhoneError] = useState('');

  const validateMobileNumber = (number) => {
    // Check for Australian mobile format (04XXXXXXXX)
    const mobilePattern = /^04\d{8}$/;
    return mobilePattern.test(number);
  };

  const handlePhoneChange = (e) => {
    let number = e.target.value;
    
    // Remove any non-digits
    number = number.replace(/\D/g, '');
    
    // Ensure number starts with '04'
    if (number && !number.startsWith('04')) {
      number = '04' + number;
    }
    
    // Limit to 10 digits
    number = number.slice(0, 10);
    
    setData({...data, phone: number});
    
    if (number && !validateMobileNumber(number)) {
      setPhoneError('Please enter a valid mobile number starting with 04');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneError && validateMobileNumber(data.phone)) {
      // Format phone before submitting (convert to +61 format)
      const formattedPhone = '+61' + data.phone.substring(1);
      setData({...data, phone: formattedPhone});
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          required
          placeholder="e.g., Jane Smith"
          value={data.fullName}
          onChange={(e) => setData({...data, fullName: e.target.value})}
        />
    </div>
      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-container">
          <span className="phone-prefix">+61</span>
          <input
            type="tel"
            required
            placeholder="0412345678"
            value={data.phone}
            onChange={handlePhoneChange}
            className={`phone-input ${phoneError ? 'error' : ''}`}
          />
        </div>
        {phoneError && <span className="error-message">{phoneError}</span>}
      </div>
      <button 
        type="submit" 
        className="booking-button next"
        disabled={phoneError || !data.phone}
      >
        Next
      </button>
    </form>
  );
};

export default ClientInfoForm;