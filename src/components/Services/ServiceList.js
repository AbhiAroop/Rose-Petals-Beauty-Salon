import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import '../styles/ServiceList.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://rose-petals-backend.vercel.app/api/services');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                console.log('API Response:', data); // Debug log

                // Check if data is array
                if (!Array.isArray(data)) {
                    throw new Error('Expected array of services');
                }
                
                // Group services by type
                const grouped = data.reduce((acc, service) => {
                    const type = service.ServiceType || 'Other';
                    if (!acc[type]) {
                        acc[type] = [];
                    }
                    acc[type].push(service);
                    return acc;
                }, {});
                
                console.log('Grouped Data:', grouped); // Debug log
                setServices(grouped);
            } catch (err) {
                console.error('Error details:', err);
                setError(err.message);
            }
        };

        fetchServices();
    }, []);

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    if (Object.keys(services).length === 0) {
        return <div className="loading">Loading services...</div>;
    }

    return (
        <div className="services-page">
            <h1 className="services-title">Our Services</h1>
            <div className="services-container">
                {Object.entries(services).map(([type, serviceList]) => (
                    <div key={type} className="service-type-section">
                        <h2 className="service-type-title">{type}</h2>
                        <div className="service-grid">
                            {serviceList.map((service, index) => (
                                <ServiceCard key={`${type}-${index}`} service={service} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServiceList;