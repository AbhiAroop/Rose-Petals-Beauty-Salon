import React from 'react';

const ServiceCard = ({ service }) => {
    return (
        <div className="service-card">
            <h3>{service.ServiceName}</h3>
            <h4>{service.ServiceShortHeading}</h4>
            <p>{service.ServiceDesc}</p>
        </div>
    );
};

export default ServiceCard;