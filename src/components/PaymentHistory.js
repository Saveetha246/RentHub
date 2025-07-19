import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PaymentHistory.scss"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faHome,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,

} from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";
 
const PaymentHistory = () => {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("jwt");
  const userId = user?.userId;
 
  useEffect(() => {
    if (!userId || !token) {
      setError("Authentication failed. Please log in again.");
      setLoading(false);
      return;
    }
 
    const fetchTenantPaymentHistory = async () => {
      setLoading(true); 
      try {
       
        const response = await api.get(
          `/v1/paymentHistory/tenant/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setPayments(response.data);
      } catch (err) {
        console.error("Error fetching tenant payment history:", err);
       
        setError(err.response?.data?.message || "Failed to retrieve your payment history.");
      } finally {
        setLoading(false); 
      }
    };
 
    fetchTenantPaymentHistory();
  }, [userId, token]); 
 
  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Fetching Your Payment History...</p>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />{" "}
        <p className="error-message">{error}</p>
      </div>
    );
 
  return (
    <div className="payment-history-container">
      <h2 className="page-title">
        <FontAwesomeIcon icon={faMoneyBill} className="title-icon" /> Your Payment History
      </h2>
 
      {payments.length === 0 ? (
        <div className="no-records">
          <FontAwesomeIcon icon={faMoneyBill} className="no-records-icon" />
          <p>No payment records found for your account.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
              
                <th><FontAwesomeIcon icon={faHome} className="table-icon" /> Property</th>
               
                <th><FontAwesomeIcon icon={faMoneyBill} className="table-icon" /> Amount Paid</th>
                <th><FontAwesomeIcon icon={faCalendarAlt} className="table-icon" /> Paid On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                
                <tr key={payment.paymentId || payment.leaseId}>
                  
                  <td>{ `${payment.bhk}-${payment.propertyType} ${  payment.address.city},${payment.address.state}` }</td> 
                  <td>₹{payment.amount}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className={`status-${payment.status?.toLowerCase()}`}>
                    {payment.status === "SUCCESS" && <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />}
                    {payment.status === "FAILED" && <FontAwesomeIcon icon={faTimesCircle} className="failed-icon" />}
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default PaymentHistory;
 