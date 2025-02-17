import React from 'react';
import '../styles/ServiceCard.css';

const ServiceCard = ({ service }) => {
    return (
        <div className="service-card">
            <div className="service-content">
                <h3 className="service-name">{service.ServiceName}</h3>
                <p className="service-description">{service.ServiceDesc}</p>
                <div className="service-details">
                    <span className="service-duration">{service.Duration} mins</span>
                    <span className="service-price">${service.Price}</span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;