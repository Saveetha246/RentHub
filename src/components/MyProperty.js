import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/MyProperty.scss";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const MyProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 3; 

  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("jwt");

      if (!user?.userId || !token) {
        setError("User ID or authentication token is missing.");
        setLoading(false);
        return;
      }

      const response = await api.get(
        `/v1/landlord/properties/${user.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties(response.data);
    } catch (err) {
      setError("Failed to fetch properties. Check API access.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

  return (
    <div className="property-lists">
      {currentProperties.length > 0 ? (
        currentProperties.map((property) => (
          <div key={property.propertyId} className="property-cards">
            {property.image1 ? (
              <img src={`data:image/jpeg;base64,${property.image1}`} alt="Property" className="property-images" />
            ) : (
              <p>No image available</p>
            )}
            <div className="property-infos">
              <p className="rents"><strong>Amount:</strong> ₹{property.rentAmount}</p>
              <p className="locations"><strong>Address:</strong> {property.address?.streetName}, {property.address?.city}</p>
              <button
                className="manage-buttons"
                onClick={() => navigate(`/landlord/property-details/${property.propertyId}`)}
              >
                Manage
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No properties found.</p>
      )}

      {properties.length > propertiesPerPage && (
        <div className="paginations">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage} of {Math.ceil(properties.length / propertiesPerPage)}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(properties.length / propertiesPerPage)))}
            disabled={indexOfLastProperty >= properties.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProperty;