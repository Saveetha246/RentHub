import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PaymentHistoryLandLord.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faHome, faCalendarAlt, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import api from "../utils/api";

const PaymentHistoryLandLord = () => {
  const [properties, setProperties] = useState([]);
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

    const fetchProperties = async () => {
      try {
        const response = await api.get(
          `/v1/landlord/properties/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProperties(response.data);

        if (response.data.length > 0) {
          fetchPaymentHistory(response.data.map(p => p.propertyId));
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentHistory = async (propertyIds) => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          propertyIds.map(propertyId =>
            api.get(`/v1/landlord/${propertyId}/history`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setPayments(responses.flatMap(response => response.data));
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to retrieve payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId, token]);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Fetching Payment History...</p></div>;
  if (error) return <div className="error-container"><FontAwesomeIcon icon={faTimesCircle} className="error-icon" /> <p className="error-message">{error}</p></div>;

  return (
    <div className="payment-history-container">
      <h2 className="page-title">
        <FontAwesomeIcon icon={faMoneyBill} className="title-icon" /> Payment History
      </h2>

      {payments.length === 0 ? (
        <div className="no-records">
          <FontAwesomeIcon icon={faHome} className="no-records-icon" />
          <p>No payment records found for your properties.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th><FontAwesomeIcon icon={faHome} className="table-icon" /> Property</th>
                <th>Tenant Name</th>
                <th><FontAwesomeIcon icon={faMoneyBill} className="table-icon" /> Amount Paid</th>
                <th><FontAwesomeIcon icon={faCalendarAlt} className="table-icon" /> Paid On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.leaseId}>
                  <td>{`${payment.bhk}-${payment.propertyType}-   ${payment.address.city}`}</td>
                  <td>{payment.paymentInfo?.name || "N/A"}</td>
                  <td>₹{payment.amount}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className={`status-${payment.status.toLowerCase()}`}>
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

export default PaymentHistoryLandLord;