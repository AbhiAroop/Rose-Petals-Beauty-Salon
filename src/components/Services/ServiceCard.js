import React from 'react';

const ServiceCard = ({ service }) => {
    const priceDisplay = service.priceFrom==="true"
        ? `From $${service.Price}` 
        : `$${service.Price}`;

    return (
        <div className="service-card">
            <h3>{service.ServiceName}</h3>
            <h4>{service.ServiceShortHeading}</h4>
            <p>{service.ServiceDesc}</p>
            <div className="price-tag">{priceDisplay}</div>
        </div>
    );
};

export default ServiceCard;