import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditProperty.scss';
import api from '../utils/api';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState({
        propertyType: '',
        bhk: '',
        rentAmount: '',
        availabilityStatus: 'Available',
        description: '',
        address: {
            streetName: '',
            city: '',
            state: '',
            pinCode: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('jwt');

            if (!token) {
                setError("Authentication failed. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(
                    `/v1/landlord/properties/viewProperty/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                const fetchedProperty = response.data;
                setProperty({
                    propertyType: fetchedProperty.propertyType || '',
                    bhk: fetchedProperty.bhk || '',
                    rentAmount: fetchedProperty.rentAmount || '',
                    availabilityStatus: fetchedProperty.availabilityStatus || 'Available',
                    description: fetchedProperty.description || '',
                    address: {
                        streetName: fetchedProperty.address?.streetName || '',
                        city: fetchedProperty.address?.city || '',
                        state: fetchedProperty.address?.state || '',
                        pinCode: fetchedProperty.address?.pinCode || ''
                    }
                });
            } catch (err) {
                console.error('Error fetching property details:', err);
                setError(`Failed to load property: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProperty(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        const token = localStorage.getItem('jwt');

        if (!token) {
            setError("Authentication token missing. Please log in.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.put(
                `/v1/landlord/properties/${id}`,
                property, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSuccessMessage('Property updated successfully!');
                setTimeout(() => {
                    navigate(`/landlord/property-details/${id}`);
                }, 2000); 
            } else {
                setError('Failed to update property.');
            }
        } catch (err) {
            console.error('Error updating property:', err);
            setError(`Failed to update property: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p className="loading-message">Loading property for edit...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!property) return <p className="no-data-message">No property data available for editing.</p>;

    return (
        <div className="edit-property-container">
            <h1>Edit Property</h1>
            <form onSubmit={handleSubmit} className="edit-property-form">
                <div className="form-group">
                    <label htmlFor="propertyType">Property Type:</label>
                    <select id="propertyType" name="propertyType" value={property.propertyType || ''} onChange={handleChange} required aria-label="Property Type">
                        <option value="">Select Property Type</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="bhk">BHK:</label>
                    <select id="bhk" name="bhk" value={property.bhk || ''} onChange={handleChange} required aria-label="BHK">
                        <option value="">Select BHK</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="rentAmount">Rent Amount:</label>
                    <input type="text" id="rentAmount" pattern="^\d+(\.\d{1,2})?$" name="rentAmount" value={property.rentAmount || ''} onChange={handleChange} required min="0" aria-label="Rent Amount" />
                </div>

                <div className="form-group">
                    <label htmlFor="availabilityStatus">Availability Status:</label>
                    <select id="availabilityStatus" name="availabilityStatus" value={property.availabilityStatus || 'Available'} onChange={handleChange} aria-label="Availability Status">
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" value={property.description || ''} onChange={handleChange} rows="4" aria-label="Description"></textarea>
                </div>

                <div className="address-section">
                    <h3>Address Details</h3>
                    <div className="form-group">
                        <label htmlFor="streetName">Street Name:</label>
                        <input type="text" id="streetName" name="streetName" value={property.address?.streetName || ''} onChange={handleAddressChange} required aria-label="Street Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input type="text" id="city" name="city" value={property.address?.city || ''} onChange={handleAddressChange} required aria-label="City" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input type="text" id="state" name="state" value={property.address?.state || ''} onChange={handleAddressChange} required aria-label="State" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pinCode">Pin Code:</label>
                        <input type="text" id="pinCode" name="pinCode" value={property.address?.pinCode || ''} onChange={handleAddressChange} required maxLength="6" aria-label="Pin Code" />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => navigate(`/landlord/property-details/${id}`)} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default EditProperty;
