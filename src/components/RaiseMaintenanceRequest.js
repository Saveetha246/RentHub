import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserId } from '../utils/auth';
import '../styles/MaintenanceRequest.scss';
import api from '../utils/api';

const RaiseMaintenanceRequest = () => {
   
    const { propertyId: initialPropertyId } = useParams();
    const navigate = useNavigate(); 
    const userId = getUserId(); 
    const jwtToken = localStorage.getItem('jwt'); 

    
    const [tenantProperties, setTenantProperties] = useState([]);
    
   
    const [formData, setFormData] = useState({
        propertyId: '',         
        transactionId: '',      
        issueType: '',
        issueDescription: '',
        status: 'PENDING',     
        tenantId: userId,       
    });

   
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState(null);       
    const [message, setMessage] = useState('');     
    
    useEffect(() => {
        const fetchTenantProperties = async () => {
           
            if (!jwtToken || !userId) {
                console.error('Authentication token or user ID missing. Redirecting to login.');
                navigate('/login'); 
                return;
            }

           
            setLoading(true);
            setError(null);
            setMessage('');

            try {
                
                const response = await api.get(`/v1/tenant/MyRentals/${userId}`, {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                });

                setTenantProperties(response.data); 
                if (initialPropertyId) {
                    const foundProperty = response.data.find(p => String(p.propertyId) === String(initialPropertyId));
                    if (foundProperty) {
                        setFormData(prev => ({
                            ...prev,
                            propertyId: foundProperty.propertyId,
                            transactionId: foundProperty.transactionId
                        }));
                    } else {
                       
                        setError('The pre-selected property is not associated with your rentals.');
                        setFormData(prev => ({ ...prev, propertyId: '', transactionId: '' }));
                    }
                }
            } catch (err) {
               
                console.error('Error fetching properties:', err.response?.data || err.message);
                setError('Failed to load properties. Please ensure you have active rentals and the backend is running.');
            } finally {
                setLoading(false); 
            }
        };

        fetchTenantProperties();
    }, [initialPropertyId, jwtToken, userId, navigate]); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage(''); 
        setError(null);

        if (name === "propertyId") {
           
            const selectedProperty = tenantProperties.find(p => String(p.propertyId) === String(value));
            setFormData(prev => ({
                ...prev,
                propertyId: value,
                transactionId: selectedProperty ? selectedProperty.transactionId : ''
            }));
            setError(null); 
        } else {
           
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage('');
        setError(null);

       
        if (!formData.propertyId) {
            setError('Please select a property for the request.');
            return;
        }
        if (!formData.issueDescription.trim()) {
            setError('Please provide a detailed description of the issue.');
            return;
        }
        if (!formData.tenantId) {
             setError('Tenant ID is missing. Please log in again.');
             return;
        }

        setLoading(true); 

        try {
           
            const requestBody = {
                propertyId: formData.propertyId,
                issueType: formData.issueType,
                issueDescription: formData.issueDescription,
                status: formData.status,
                tenantId: formData.tenantId, 
            };

            console.log("Submitting Maintenance Request:", requestBody);

           
            const response = await api.post(
                `/v1/tenant/raiseMaintenanceRequest`,
                requestBody,
                {
                    headers: { 'Authorization': `Bearer ${jwtToken}` }
                }
            );

            console.log('Maintenance Request Response:', response.data);
          
            setMessage('The Maintenance Request is Raised Successfully.');

            
            setFormData(prev => ({
                ...prev,
                propertyId: '',
                transactionId: '',
                issueType: '',
                issueDescription: '',
                status: 'PENDING',
            }));

           
setTimeout(() => {
    window.location.reload();
}, 1000);

        } catch (err) {
            
            console.error('Error submitting request:', err.response?.data || err.message);
            setError(`Failed to submit request: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        } finally {
            setLoading(false); 
        }
    };

    
    if (loading && tenantProperties.length === 0 && !error && !message) {
        return <div className="maintenance-form-container"><p>Loading your rented properties...</p></div>;
    }

    if (error && tenantProperties.length === 0) {
        return (
            <div className="maintenance-form-container">
                <p className="status-message error">{error}</p>
                <button onClick={() => navigate('/tenanthome')} className="back-btn">Back to Home</button>
            </div>
        );
    }

    if (tenantProperties.length === 0 && !loading && !error && !message) {
        return (
            <div className="maintenance-form-container">
                <p className="status-message info-message">You do not have any properties currently rented to raise a maintenance request for.</p>
                <button onClick={() => navigate('/tenanthome')} className="back-btn">Back to Home</button>
            </div>
        );
    }

   
    return (
        <div className="maintenance-form-container">
            <h2>Raise Maintenance Request</h2>

           
            {error && <p className="status-message error">{error}</p>}

            {message ? (
                
                <>
                    <p className="status-message success">{message}</p>
                    <button onClick={() => navigate('/tenanthome')} className="back-btn">Back to Home</button>
                </>
            ) : (
               
                <>
                    <form onSubmit={handleSubmit} className="maintenance-form">
                        <label htmlFor="propertyId">
                            Select Property:
                            <select
                                id="propertyId"
                                name="propertyId"
                                value={formData.propertyId}
                                onChange={handleChange}
                                required
                                disabled={tenantProperties.length === 0 || loading}
                            >
                                <option value="">-- Select a Property --</option>
                                {tenantProperties.map((prop, index) => (
                                    <option key={`${prop.propertyId}-${index}`} value={prop.propertyId}>
                                        {prop.address.streetName}, {prop.address.city} - {prop.propertyType}
                                    </option>
                                ))}
                            </select>
                            {tenantProperties.length === 0 && !loading && !error && (
                                <p className="info-message">No rented properties found.</p>
                            )}
                        </label>

                        <label htmlFor="issueType">
                            Issue Type:
                            <input
                                type="text"
                                id="issueType"
                                name="issueType"
                                value={formData.issueType}
                                onChange={handleChange}
                                required
                                disabled={loading} 
                            />
                        </label>

                        <label htmlFor="issueDescription">
                            Description:
                            <textarea
                                id="issueDescription"
                                name="issueDescription"
                                value={formData.issueDescription}
                                onChange={handleChange}
                                rows="5"
                                required
                                disabled={loading} 
                            ></textarea>
                        </label>

                        <button
                            type="submit"
                            disabled={loading || !formData.propertyId || !formData.issueDescription.trim() || !formData.tenantId}
                        >
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>

                    <button onClick={() => navigate('/tenanthome')} className="back-btn" disabled={loading}>Back to Home</button>
                </>
            )}
        </div>
    );
};

export default RaiseMaintenanceRequest;