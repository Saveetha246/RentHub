import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom"; 

import "../styles/PropertyDetailsLandLord.scss"
import api from "../utils/api";

const PropertyDetailsLandlord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const [property, setProperty] = useState(null);
  const [leaseDetails, setLeaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEditing = location.pathname.endsWith('/edit');
  
  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("User authentication failed. Please log in.");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Property ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const propertyResponse = await api.get(
          `/v1/landlord/properties/viewProperty/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Property API Response:", propertyResponse.data);
        setProperty(propertyResponse.data);

        try {
          const leaseResponse = await api.get(
            `/v1/leasedetails/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Lease API Response:", leaseResponse.data);
          setLeaseDetails(leaseResponse.data);
        } catch (leaseErr) {
          if (leaseErr.response?.status === 404) {
            setLeaseDetails(null); 
            console.log("No active lease found for this property.");
          } else {
            console.error("Error fetching lease details:", leaseErr);
          }
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        if (err.response?.status === 404) {
          setError("Property not found.");
        } else if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError(`Failed to fetch property details: ${err.response?.data?.message || err.response?.statusText || err.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isEditing ) { 
        fetchAllDetails();
    } else {
        setLoading(false); 
    }

  }, [id, navigate, isEditing]); 

  const handleEdit = () => {
    navigate(`/landlord/property-details/${id}/edit`);
  };


  if (loading) return <p className="loading-message">Loading property details...</p>;
  if (error) return <p className="error-message">{error}</p>;


  if (isEditing) {
    return <Outlet />;
  }


  if (!property) return <p className="no-details-message">No property details found.</p>;

  
  return (
    <div className="property-details-containerss">
      <h1>Property Details</h1>

      <div className="property-main-contentss">
       
        <div className="image-display-sectionss">
          {property.image1 ? (
            <img className="property-imagess" src={`data:image/jpeg;base64,${property.image1}`} alt="Property" />
          ) : (
            <p className="no-image-placeholderss">No Image Available</p>
          )}
        </div>

       
        <div className="property-info-and-actionsss">
          <div className="details-sectionss">
            <h2>Property Information</h2>
           
            <p><strong>Property Type:</strong> {property.propertyType || "N/A"}</p>
            <p><strong>BHK:</strong> {property.bhk || "N/A"}</p>
            <p><strong>Rent Amount:</strong> ₹{property.rentAmount}</p>
            <p><strong>Availability Status:</strong> {property.availabilityStatus || "N/A"}</p>
            <p><strong>Description:</strong> {property.description || "N/A"}</p>
            {property.address && (
              <p>
                <strong>Address:</strong>{" "}
                {`${property.address.streetName || ""} ${property.address.city || ""}, ${property.address.state || ""} - ${property.address.pinCode || ""}`
                  .trim()
                  .replace(/,(\s*,)+/g, ',')
                  .replace(/\s+/g, ' ')
                  .replace(/,\s*-$/, '')
                  .replace(/^-/, '')
                  .replace(/^,\s*/, '')
                  || "N/A"}
              </p>
            )}
          </div>

          <div className="button-group-alignedss">
            <button onClick={handleEdit} className="edit-buttonss">Edit Property</button>
          
          </div>
        </div>
      </div>

      <div className="lease-details-sectionss">
        <h2>Lease Details</h2>
        {leaseDetails ? (
          <div className="lease-info-cardss">
            <p><strong>Landlord Name:</strong> {leaseDetails.landlordName || "N/A"}</p>
            <p><strong>Tenant Name:</strong> {leaseDetails.tenantName || "N/A"}</p>
            <p><strong>Property Address:</strong> {leaseDetails.propertyAddress || "N/A"}</p>
            <p><strong>Lease Start Date:</strong> {new Date(leaseDetails.startDate).toLocaleDateString()}</p>
            <p><strong>Lease End Date:</strong> {new Date(leaseDetails.endDate).toLocaleDateString()}</p>
            <p><strong>Monthly Rent:</strong> ₹{leaseDetails.amount || "N/A"}</p>
          </div>
        ) : (
          <p className="no-lease-messagess">No active lease agreements found for this property.</p>
        )}
      </div>

      <div className="back-button-containerss">
        <button onClick={() => navigate("/landlord/properties")} className="back-button">
          Back to My Properties
        </button>
      </div>
    </div>
  );
};

export default PropertyDetailsLandlord;