import React from 'react';

const ClientInfoForm = ({ data, setData, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          required
          value={data.fullName}
          onChange={(e) => setData({...data, fullName: e.target.value})}
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          required
          value={data.phone}
          onChange={(e) => setData({...data, phone: e.target.value})}
        />
      </div>
      <button type="submit" className="booking-button next">
        Next
      </button>
    </form>
  );
};

export default ClientInfoForm;