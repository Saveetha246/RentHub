import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/PropertyPage.scss';
import api from '../utils/api';

const PropertyPage = () => {
  const [property, setProperty] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('propertyId');

  useEffect(() => {
    if (propertyId) {
      api.get(`/v1/landlord/properties/viewProperty/${propertyId}`)
        .then(response => setProperty(response.data))
        .catch(error => console.error('Error fetching property:', error));
    }
  }, [propertyId]);

  if (!property) return <div>Loading...</div>;

  const { address, bhk, rentAmount, availabilityStatus, description, image1, propertyType } = property;
  const imageSrc = `data:image/jpeg;base64,${image1}`;

  return (
    <div className="property-page">
      <div className="property-container">
        <img src={imageSrc} alt="Property" className="property-image" />
        <div className="property-details">
          <h1>{bhk} {propertyType} in {address.city}</h1>
          <p className="address">{address.streetName}, {address.city}, {address.state} - {address.pinCode}</p>
          <p className="price">₹{rentAmount} / month</p>
          <p className="availability">{availabilityStatus}</p>
          <p className="description">{description}</p>
          
          <div className="property-meta">
  <span className="meta-item">{bhk}</span>
  <span className="meta-item">{propertyType}</span>
</div>


          <div className="buttons">
            <button className="register">Register Now</button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
