import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBed } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import '../styles/MyRentals.scss';
import { getUserId } from '../utils/auth';
import api from '../utils/api';

const MyRentals = () => {
  const [properties, setProperties] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      api.get(`/v1/tenant/MyRentals/${userId}`)
        .then(res => setProperties(res.data))
        .catch(err => console.error('Error fetching rentals:', err));
    }
  }, [userId]);

  return (
    <div className="rentals-container">
      <h2>My Rented Properties</h2>
      <div className="rental-list">
        {properties.map((property) => (
          <div className="rental-card" key={property.propertyId}>
            <img
              src={`data:image/jpeg;base64,${property.image1}`}
              alt="Property"
              className="rental-image"
            />
            <div className="rental-details">
            <p className="location">
  <FontAwesomeIcon icon={faLocationDot} className="icon" />
  {property.address.streetName}, {property.address.city}, {property.address.state} - {property.address.pinCode}
</p>

<p className="bhk">
  <FontAwesomeIcon icon={faBed} className="icon" />
  {property.bhk} - {property.propertyType}
</p>

              <p><strong>Rent:</strong> ₹{property.rentAmount}</p>
              <p><strong>Status:</strong> {property.availabilityStatus}</p>
              <p><strong>Description:</strong> {property.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
