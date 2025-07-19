import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LandLordMaintenanceRequest.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools, 
  faHome, 
  faWrench, 
  faInfoCircle, 
  faCalendarAlt, 
  faClipboardList, 
  faEdit, 
  faSave, 
  faExclamationTriangle, 
  faSpinner 
} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const LandlordMaintenanceRequests = () => {
  const [propertiesWithRequests, setPropertiesWithRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("jwt");
  const userId = user?.userId;

  useEffect(() => {
    if (!userId || !token) {
      setError("User ID or authentication token is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const propertiesResponse = await api.get(
          `/v1/landlord/properties/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const propertiesData = propertiesResponse.data;

        const maintenanceRequestsResponse = await api.get(
          `/v1/landlord/viewAllMaintenaceReq/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allRequestsData = maintenanceRequestsResponse.data;

        const combinedData = propertiesData.map((property) => ({
          ...property,
          maintenanceRequests: allRequestsData.filter(
            (request) =>
              request.propertyId === property.propertyId &&
              (request.status === "OPEN" || request.status === "IN_PROGRESS")
          ),
        }));
        setPropertiesWithRequests(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch properties and maintenance requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token, setLoading, setError, setPropertiesWithRequests]);

  const handleStatusChange = (requestId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [requestId]: newStatus,
    }));
  };

  const saveStatus = async (requestId) => {
    const newStatus = statusUpdates[requestId];
    if (!newStatus) return;

    try {
      const response = await api.patch(
        `/v1/landlord/updateMaintenanceReqStatus/${requestId}/status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setPropertiesWithRequests((prevData) =>
          prevData.map((property) => ({
            ...property,
            maintenanceRequests: property.maintenanceRequests.filter((req) => {
              if (req.requestId === requestId) {
                return newStatus !== "RESOLVED" && newStatus !== "CLOSED";
              }
              return true;
            }).map((req) =>
              req.requestId === requestId ? { ...req, status: newStatus } : req
            ),
          }))
        );
        setStatusUpdates((prev) => {
          const newState = { ...prev };
          delete newState[requestId];
          return newState;
        });
      } else {
        setError("Failed to update status on the backend.");
      }
    } catch (error) {
      console.error("Error saving status:", error);
      setError("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
        <p>Loading properties and requests...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
        <p>{error}</p>
      </div>
    );

  return (
    <div className="landlord-maintenance-container">
      <h2 className="page-title">
        <FontAwesomeIcon icon={faTools} className="title-icon" />
        Maintenance Hub
      </h2>

      {propertiesWithRequests.length === 0 ? (
        <div className="no-records">
          <FontAwesomeIcon icon={faExclamationTriangle} className="no-records-icon" />
          <p>No properties found or no active maintenance requests.</p>
        </div>
      ) : (
        <div className="properties-list">
          {propertiesWithRequests.map((property) => (
            <div key={property.propertyId} className="property-section">
              <div className="property-header">
              
                <h3 className="property-title">
                  <FontAwesomeIcon icon={faHome} className="property-icon" />
                  {property.propertyType} 
                </h3>
               
                <p className="property-address">
                  <strong>Address:</strong> {property.address.streetName},{" "}
                  {property.address.city}, {property.address.state},{" "}
                  {property.address.pinCode}
                </p>
                <p className="property-status">
                  <strong>Availability:</strong> {property.availabilityStatus}
                </p>
              </div>

              {property.maintenanceRequests.length > 0 ? (
                <div className="table-wrapper">
                  <table className="maintenance-table responsive-table">
                    <thead>
                      <tr>
                        <th><FontAwesomeIcon icon={faWrench} className="table-icon" /> Issue Type</th>
                        <th><FontAwesomeIcon icon={faInfoCircle} className="table-icon" /> Description</th>
                        {}
                        <th><FontAwesomeIcon icon={faClipboardList} className="table-icon" /> Current Status</th>
                        <th><FontAwesomeIcon icon={faEdit} className="table-icon" /> Update Status</th>
                        <th><FontAwesomeIcon icon={faSave} className="table-icon" /> Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.maintenanceRequests.map((request) => (
                        <tr key={request.requestId}>
                          <td>{request.issueType}</td>
                          <td>{request.issueDescription}</td>
                          {}
                          <td>
                            <span
                              className={`status-${request.status
                                .toLowerCase()
                                .replace("_", "-")}`}
                            >
                              {request.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            <select
                              id={`status-${request.requestId}`}
                              value={
                                statusUpdates[request.requestId] || request.status
                              }
                              onChange={(e) =>
                                handleStatusChange(request.requestId, e.target.value)
                              }
                              className="status-select"
                            >
                              <option value={request.status}>
                                {request.status.replace("_", " ")}
                              </option>

                              {request.status === "OPEN" && (
                                <option value="IN_PROGRESS">In Progress</option>
                              )}
                              {request.status === "OPEN" && (
                                <option value="RESOLVED">Resolved</option>
                              )}
                              {request.status === "OPEN" && (
                                <option value="CLOSED">Closed</option>
                              )}

                              {request.status === "IN_PROGRESS" && (
                                <option value="RESOLVED">Resolved</option>
                              )}
                              {request.status === "IN_PROGRESS" && (
                                <option value="CLOSED">Closed</option>
                              )}
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => saveStatus(request.requestId)}
                              className="save-button"
                              disabled={!statusUpdates[request.requestId] || statusUpdates[request.requestId] === request.status}
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-issues">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="no-records-icon" />
                  No open or in-progress maintenance issues for this property.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordMaintenanceRequests;