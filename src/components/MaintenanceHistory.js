import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getUserId } from '../utils/auth';
import styles from '../styles/Maintenance.module.scss'; 

function MaintenanceHistory() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    
    const currentUserId = getUserId();

    if (currentUserId) {
      setTenantId(currentUserId);
      console.log("Tenant ID from localStorage:", currentUserId); 
    } else {
      setError("User ID not found. Please ensure you are logged in.");
      setLoading(false);
    }
  }, []); 
  useEffect(() => {
   
    if (tenantId) {
      const fetchMaintenanceHistory = async () => {
        try {
          
          const response = await api.get(`v1/tenant/viewAllMaintenanceReq/${tenantId}`);

         
          setMaintenanceRequests(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching maintenance history:", err);
         
          if (err.response?.status !== 401) {
              setError("Failed to fetch maintenance history. Please try again later.");
          }
          setLoading(false);
        }
      };
      fetchMaintenanceHistory();
    } else if (tenantId === null && !error) {
    
      setLoading(false);
    }
  }, [tenantId, error]); 

  if (loading) {
    return <div className={styles.loading}>Loading maintenance history...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.maintenanceHistoryContainer}>
      <h2>Your Maintenance Request History</h2>
      {maintenanceRequests.length === 0 ? (
        <p className={styles.noRequestsMessage}>No maintenance requests raised yet.</p>
      ) : (
        <div className={styles.tableWrapper}> 
          <table className={styles.maintenanceTable}>
            <thead>
              <tr>
                <th>Property Details</th>
                <th>Issue Type</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceRequests.map((request) => (
                <tr key={request.requestId}>
                  <td>
                  
                    <div className={styles.propertyDetails}>
                      <span className={styles.propertyInfo}>
                        {request.propertyType} ({request.bhk})
                      </span>
                      {request.address && ( 
                        <span className={styles.addressInfo}>
                          {request.address.streetName}, {request.address.city}, {request.address.state} - {request.address.pinCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{request.issueType}</td>
                  <td>{request.issueDescription}</td>
                  <td>
                   
                    <span className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MaintenanceHistory;