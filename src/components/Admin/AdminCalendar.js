import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AdminNavbar from './AdminNavbar';
import { useAdmin } from './AdminContext';
import AdminBookingModal from './AdminBookingModal';

const AdminCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { admin } = useAdmin();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const navigate = useNavigate();
  
  const getStatusColor = useCallback((status) => {
    const colors = {
      'Requested': '#ee308f',
      'Approved': '#90EE90',
      'Denied': '#ff6b6b',
      'Completed': '#808080',
      'Tentative': '#ee308f',
      'Cancelled': '#DC143C',
      'Deleted': '#000000'
    };
    return colors[status] || '#808080';
  }, []);

  const calculateEndTime = useCallback((start, duration) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    return endDate;
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!admin?.token) {
      console.error('No admin token available');
      return;
    }
  
    try {
      console.log('Fetching appointments with token:', admin.token.substring(0, 20) + '...');
  
      const response = await fetch('https://rose-petals-backend.vercel.app/api/admin/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${admin.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          console.error('Token validation failed - redirecting to login');
          navigate('/admin/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received appointments:', data);
  
      if (!Array.isArray(data)) {
        throw new Error('Expected array of appointments');
      }
  
      const events = data.map(app => ({
        id: app.AppointmentServiceID,
        title: `${app.ClientName} - ${app.ServiceNames}`,
        start: new Date(app.AppointmentDate),
        end: calculateEndTime(app.AppointmentDate, app.TotalDuration),
        extendedProps: {
          status: app.Status,
          services: app.Services,
          clientName: app.ClientName,
          phone: app.Phone,
          duration: app.TotalDuration
        },
        backgroundColor: getStatusColor(app.Status),
        borderColor: getStatusColor(app.Status),
        textColor: '#000000',
        display: 'block'
      }));
      
      setAppointments(events);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.message.includes('401')) {
        navigate('/admin/login');
      }
    }
  }, [admin, calculateEndTime, getStatusColor, navigate]);
  
  const initiateDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirm(true);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDateTime(selectInfo.start);
    setShowBookingModal(true);
  };


  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`https://rose-petals-backend.vercel.app/api/appointments/${appointmentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      });
  
      if (!response.ok) throw new Error('Failed to update appointment status');
  
      await fetchAppointments();
      setSelectedEvent(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleBookingSubmit = async (formData) => {
    try {
      if (!admin?.token) {
        throw new Error('No admin token available');
      }
  
      // Convert to AEST (UTC+10)
      const localDate = new Date(formData.appointmentTime);
      const aestDate = new Date(localDate.getTime() + (11 * 60 * 60 * 1000));
  
      const bookingData = {
        fullName: formData.fullName,
        phone: formData.phone,
        services: formData.selectedServices.map(service => ({
          ServiceID: service.ServiceID,
          ServiceName: service.ServiceName,
          Price: service.Price
        })),
        appointmentTime: aestDate.toISOString()
      };
  
      const response = await fetch('https://rose-petals-backend.vercel.app/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
  
      await fetchAppointments(); // Refresh the calendar
      setShowBookingModal(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(`Failed to create booking: ${error.message}`);
    }
  }; 
  
  const ServiceBox = ({ service }) => {
    // Service format: "ServiceName ($Price)"
    const [name, price] = service.split(' ($');
    return (
      <div className="service-box">
        <div className="service-name">{name}</div>
        <div className="service-price">${price.replace(')', '')}</div>
      </div>
    );
  };
  
  const EventContent = ({ event }) => {
    const startTime = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const services = event.extendedProps.services.split(', ');
  
    return (
      <div className="calendar-event-content">
        <div className="event-time">
          {startTime} - {endTime}
        </div>
        <div className="event-header">
          <div className="client-info">
            <strong className="event-client-name-txt">Client: <strong className="event-client-name">{event.extendedProps.clientName}</strong></strong>
            <strong className="event-client-phone-text">Phone: <strong className="event-client-phone">{event.extendedProps.phone}</strong></strong>
          </div>
        </div>
        <div className="event-services">
          {services.map((service, index) => (
            <div key={index} className="calendar-service-box">
              {service.split(' ($')[0]}
            </div>
          ))}
        </div>
        <div className="event-status" style={{ color: getStatusColor(event.extendedProps.status) }}>
          {event.extendedProps.status}
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!admin?.token) {
        console.error('No admin token found');
        return;
      }

      await fetchAppointments();
    };

    checkAuthAndFetch();

    // Refresh every 5 minutes instead of every minute
    const interval = setInterval(fetchAppointments, 300000);
    return () => clearInterval(interval);
  }, [admin, fetchAppointments]);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await fetch(`https://rose-petals-backend.vercel.app/api/admin/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify({ status })
      });
      
      fetchAppointments();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-calendar">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={appointments}
          eventContent={EventContent}
          eventClick={handleEventClick}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="auto"
          expandRows={true}
          allDaySlot={false}
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          nowIndicator={true}
          dayMaxEvents={false}
          eventDisplay="block"
          slotEventOverlap={false}
          eventMinHeight={100}
          contentHeight="auto"
          displayEventTime={true}
          displayEventEnd={true}
          selectable={true}
          select={handleDateSelect}
        
      />
      <AdminBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          initialDateTime={selectedDateTime}
          onSubmit={handleBookingSubmit}
        />
        
        {selectedEvent && (
          <div className="appointment-details">
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <span className="close-icon" onClick={() => setSelectedEvent(null)}>×</span>
            </div>
            <p><strong>Client:</strong> {selectedEvent.extendedProps.clientName}</p>
            <p><strong>Phone:</strong> {selectedEvent.extendedProps.phone}</p>
            <div className="services-section">
            <h4>Services:</h4>
            <div className="services-grid">
              {selectedEvent.extendedProps.services.split(', ').map((service, index) => (
                <ServiceBox key={index} service={service} />
              ))}
            </div>
          </div>
          <div className="appointment-datetime">
            <p><strong>Date:</strong> {formatDate(selectedEvent.start)}</p>
            <p><strong>Time:</strong> {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}</p>
          </div>
            <p><strong>Status:</strong> {selectedEvent.extendedProps.status}</p>
            <p><strong>Total Duration:</strong> {selectedEvent.extendedProps.duration} minutes</p>
            
            {(
              <div className="action-buttons">
              <div className="status-buttons">
                <button 
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'Approved')}
                  className="approve-btn"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'Tentative')}
                  className="tentative-btn"
                >
                  Tentative
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'Cancelled')}
                  className="cancelled-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedEvent.id, 'Denied')}
                  className="deny-btn"
                >
                  Decline
                </button>
               </div>
              </div>
            )}
            <button 
              onClick={() => initiateDelete(selectedEvent.id)}
              className="delete-btn"
          >
            Delete Appointment
          </button>
          </div>
        )}
        {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <h3>Delete Appointment</h3>
            <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
            <div className="delete-confirmation-buttons">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="cancel-delete-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminCalendar;