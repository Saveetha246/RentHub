import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ApplicationCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
 
const ApplicationCard = ({ userId }) => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchApplications = async () => {
            const jwtToken = localStorage.getItem('jwt');
            if (!jwtToken) {
                navigate('/login');
                return;
            }
            try {
                const response = await api.get(`/v1/tenant/ApplicationStatus/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching application status:', error);
            }
        };
 
        if (userId) {
            fetchApplications();
        }
    }, [userId, navigate]);
 
    const handleProceedToAgreement = (transactionId) => {
        if (transactionId) {
            navigate(`/Tenant/lease-agreement/${transactionId}`);
        } else {
            console.error('Transaction ID is missing for agreement.');
        }
    };
 
    const filteredApplications = applications.filter(
        app => app.status.toLowerCase() !== 'completed'
    );
 
    return (
        <div className="application-section">
            <h2 className="title">My Applications</h2>
            <div className="application-list">
                {filteredApplications.length === 0 ? (
                    <p className="no-applications">No applications found.</p>
                ) : (
                    filteredApplications.map((app, index) => (
                        <div className="application-card horizontal" key={index}>
                            <img
                                src={`data:image/jpeg;base64,${app.image}`}
                                alt="Property"
                                className="property-image"
                            />
                            <div className="application-info">
                                <h3>{app.bhk} - {app.propertyType || 'Apartment'}</h3>
                                <p className="location">
                                    <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
                                    {app.address}
                                </p>
                                <p className="description">{app.description}</p>
                                <span className={`status ${app.status.toLowerCase().replace(/\s/g, '-')}`}>
                                    {app.status}
                                </span>
                                <div className="button-group">
                                    {app.status.toLowerCase() === 'accepted' && (
                                        <button
                                            className="proceed-btn"
                                            onClick={() => handleProceedToAgreement(app.transactionId)}
                                        >
                                            <b>Proceed to Agreement</b>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
 
export default ApplicationCard;
 
 