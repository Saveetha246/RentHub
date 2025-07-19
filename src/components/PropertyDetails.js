import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/PropertyDetails.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faBed } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';
 
const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    api
      .get(`/v1/tenant/viewProperty/${propertyId}`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error('Error fetching property:', err));
  }, [propertyId]);
 
  if (!property) return <p>Loading...</p>;
 
  return (
<div className="property-details-container">
<div className="property-image">
        {property.image1 && (
<img src={`data:image/jpeg;base64,${property.image1}`} alt="Property" />
        )}
</div>
 
      <div className="property-info">
<h2 className="title">{property.bhk} Apartment in {property.address?.city}</h2>
<p className="address"><strong>Address:</strong> {property.address?.streetName}, {property.address?.city}, {property.address?.state} - {property.address?.pinCode}</p>
<p className="price"><strong>Rent:</strong> ₹{property.rentAmount?.toLocaleString()} / month</p>
<p className="description"><strong>Description:</strong> {property.description}</p>
<p className="availability"><strong>Status:</strong> {property.availabilityStatus}</p>
 
        <div className="features">
<div className="feature-item">
<FontAwesomeIcon icon={faBuilding} className="icon" />
<strong>Property Type:</strong> {property.propertyType}
</div>
<div className="feature-item">
<FontAwesomeIcon icon={faBed} className="icon" />
<strong>Bedrooms:</strong> {property.bhk}
</div>
</div>
 
        <div className="actions">
<button
            className="contact"
            onClick={() => navigate(`/apply/${propertyId}`)}
            disabled={property.availabilityStatus !== 'Available'}
>
            {property.availabilityStatus === 'Available' ? 'Apply' : 'Not Available'}
</button>
</div>
</div>
</div>
  );
};
 
export default PropertyDetails;