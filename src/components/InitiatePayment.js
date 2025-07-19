import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InitiatePayment.scss';
import api from '../utils/api';
 
const InitiatePayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentInitiationStatus, setPaymentInitiationStatus] = useState(null);
  const storedLeaseId = localStorage.getItem('currentLeaseId');
  const storedPaymentAmount = localStorage.getItem('paymentAmount');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
 
  useEffect(() => {
    console.log('InitiatePayment mounted. Lease ID:', storedLeaseId, 'Amount:', storedPaymentAmount);
    if (storedLeaseId) {
      if (storedPaymentAmount) {
        setAmount(storedPaymentAmount);
      } else {
        console.warn('Payment amount not found in localStorage.');
      }
    } else {
      console.log('InitiatePayment: No lease ID found in localStorage.');
    }
  }, [storedLeaseId, storedPaymentAmount]);
 
  useEffect(() => {
    if (paymentSuccessful) {
      const timer = setTimeout(() => {
        navigate('/Tenant/my-rentals');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccessful, navigate]);
 
  const validateForm = () => {
    let errors = {};
    let isValid = true;
 
    if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = 'Card number must be 16 digits.';
      isValid = false;
    }
 
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      errors.expiryDate = 'Expiry date must be in MM/YY format.';
      isValid = false;
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
 
      if (year < currentYear || (year === currentYear && month < currentMonth) || month < 1 || month > 12) {
        errors.expiryDate = 'Enter a valid future expiry date.';
        isValid = false;
      }
    }
 
    if (!/^\d{3}$/.test(cvv)) {
      errors.cvv = 'CVV must be 3 digits.';
      isValid = false;
    }
 
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errors.amount = 'Amount must be a valid positive number.';
      isValid = false;
    }
 
    if (!name.trim()) {
      errors.name = 'Cardholder name is required.';
      isValid = false;
    }
 
    setValidationErrors(errors);
    return isValid;
  };
 
  const handleInitiatePayment = async () => {
    if (!storedLeaseId) {
      setPaymentInitiationStatus({ success: false, message: 'Lease ID not found. Please sign the agreement first.' });
      return;
    }
 
    if (!validateForm()) {
      return;
    }
 
    setPaymentInitiationStatus({ loading: true });
    setPaymentSuccessful(false);
 
    try {
      const response = await api.post(`/v1/tenant/payment/initiate/${storedLeaseId}`, {
        amount: parseFloat(amount),
        paymentDate: new Date().toISOString().slice(0, 10),
        paymentInfo: {
          cardNumber: parseInt(cardNumber),
          expiryDate: expiryDate,
          cvv: parseInt(cvv),
          name: name,
        },
      });
 
      if (response.status === 200) {
        setPaymentInitiationStatus({ success: true, message: 'Payment successful!' });
        setPaymentSuccessful(true);
        localStorage.removeItem('paymentAmount');
      } else {
        setPaymentInitiationStatus({ success: false, message: `Payment failed: ${response.data?.message || response.statusText}` });
        setPaymentSuccessful(false);
      }
    } catch (error) {
      setPaymentInitiationStatus({ success: false, message: `Error initiating payment: ${error.message}` });
      setPaymentSuccessful(false);
    } finally {
      setPaymentInitiationStatus(prevState => ({ ...prevState, loading: false }));
    }
  };
 
  return (
    <div className="initiate-payment-container super-payment-container">
      <h2 className="payment-title super-payment-title">Make Payment</h2>
      {storedLeaseId ? (
        <>
          <div className="form-group super-form-group">
            <label htmlFor="amount" className="form-label super-form-label">Amount:</label>
            <input
              type="number"
              id="amount"
              className={`form-input super-form-input ${validationErrors.amount ? 'error' : ''}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            {validationErrors.amount && <p className="error-message super-error-message">{validationErrors.amount}</p>}
          </div>
          <div className="form-group super-form-group">
            <label htmlFor="cardNumber" className="form-label super-form-label">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              className={`form-input super-form-input ${validationErrors.cardNumber ? 'error' : ''}`}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Enter 16-digit card number"
              required
            />
            {validationErrors.cardNumber && <p className="error-message super-error-message">{validationErrors.cardNumber}</p>}
          </div>
          <div className="form-group super-form-group">
            <label htmlFor="expiryDate" className="form-label super-form-label">Expiry Date (MM/YY):</label>
            <input
              type="text"
              id="expiryDate"
              className={`form-input super-form-input ${validationErrors.expiryDate ? 'error' : ''}`}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
            />
            {validationErrors.expiryDate && <p className="error-message super-error-message">{validationErrors.expiryDate}</p>}
          </div>
          <div className="form-group super-form-group">
            <label htmlFor="cvv" className="form-label super-form-label">CVV:</label>
            <input
              type="text"
              id="cvv"
              className={`form-input super-form-input ${validationErrors.cvv ? 'error' : ''}`}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="Enter 3-digit CVV"
              required
            />
            {validationErrors.cvv && <p className="error-message super-error-message">{validationErrors.cvv}</p>}
          </div>
          <div className="form-group super-form-group">
            <label htmlFor="name" className="form-label super-form-label">Cardholder Name:</label>
            <input
              type="text"
              id="name"
              className={`form-input super-form-input ${validationErrors.name ? 'error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name on card"
              required
            />
            {validationErrors.name && <p className="error-message super-error-message">{validationErrors.name}</p>}
          </div>
          <button className="initiate-button super-initiate-button" onClick={handleInitiatePayment} disabled={paymentInitiationStatus?.loading}>
            {paymentInitiationStatus?.loading ? <span className="loading-spinner"></span> : 'Pay Now'}
          </button>
 
          {paymentInitiationStatus && (
            <div className={`payment-status ${paymentInitiationStatus.success ? 'success super-success' : 'error super-error'}`}>
              {paymentInitiationStatus.loading && <p className="status-message super-status-message">Processing payment...</p>}
              {paymentInitiationStatus.message && <p className="status-message super-status-message">{paymentInitiationStatus.message}</p>}
            </div>
          )}
        </>
      ) : (
        <p className="no-lease-id super-no-lease-id">No Lease ID found. Please sign the lease agreement first.</p>
      )}
    </div>
  );
};
 
export default InitiatePayment;
 