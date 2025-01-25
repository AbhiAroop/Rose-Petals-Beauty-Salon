import React, { useState, useEffect } from 'react';

const TimeSelection = ({ data, setData, onNext, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (selectedMonth && selectedDay && selectedYear && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const date = new Date(
        parseInt(selectedYear),
        months.indexOf(selectedMonth),
        parseInt(selectedDay),
        parseInt(hours),
        parseInt(minutes)
      );
      setData({ ...data, appointmentTime: date });
    }
  }, [selectedMonth, selectedDay, selectedYear, selectedTime]);

  const generateDays = () => {
    if (!selectedMonth || !selectedYear) return [];
    const days = [];
    const daysInMonth = new Date(parseInt(selectedYear), months.indexOf(selectedMonth) + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
    return slots;
  };

  return (
    <div className="booking-step">
      <h3>Select Appointment Date and Time</h3>
      <div className="datetime-picker">
        <div className="date-section">
          <div className="select-group">
            <label>Month</label>
            <select 
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDay('');
              }}
              className="date-select"
            >
              <option value="">Select Month</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label>Day</label>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="date-select"
              disabled={!selectedMonth || !selectedYear}
            >
              <option value="">Select Day</option>
              {generateDays().map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label>Year</label>
            <select 
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedDay('');
              }}
              className="date-select"
            >
              <option value="">Select Year</option>
              {generateYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="time-section">
          <label>Time</label>
          <select 
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="time-select"
          >
            <option value="">Select Time</option>
            {generateTimeSlots().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="booking-buttons">
        <button onClick={onBack} className="booking-button back">Back</button>
        <button 
          onClick={onNext}
          disabled={!selectedMonth || !selectedDay || !selectedYear || !selectedTime}
          className="booking-button next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TimeSelection;