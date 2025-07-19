import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ApplyForm.scss';
import { getUserId } from '../utils/auth';
import api from '../utils/api';
 
const ApplyForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 
  const applyForProperty = async () => {
    const userId = getUserId();
 
    if (!startDate || !endDate) {
      setSuccessMessage('Please select both start and end dates.');
      return;
    }
 
    const rentalTransactionDto = {
      startDate,
      endDate,
    };
 
    try {
      await api.post(
        `/v1/tenant/${userId}/${propertyId}/apply`,
        rentalTransactionDto,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );
      setSuccessMessage('Application submitted successfully!');
      setTimeout(() => {
        navigate('/Tenant/applications');
      }, 2000);
    } catch (error) {
      console.error('Error applying for property:', error.response?.data || error.message);
      setSuccessMessage('You have more time to renew your property.');
    }
  };
 
  const handleStartDateChange = (e) => {
    const selectedStartDate = new Date(e.target.value);
    const today = new Date();
 
    if (selectedStartDate < today) {
      setSuccessMessage('Start date cannot be in the past.');
      setStartDate('');
      setEndDate('');
      return;
    }
 
    setStartDate(e.target.value);
 
    const endDate = new Date(selectedStartDate);
    endDate.setMonth(endDate.getMonth() + 11);
    setEndDate(endDate.toISOString().split('T')[0]);
  };
 
  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const selectedStartDate = new Date(startDate);
 
    if (selectedEndDate <= selectedStartDate) {
      setSuccessMessage('End date must be after the start date.');
      setEndDate('');
      return;
    }
 
    const monthDifference = (selectedEndDate.getFullYear() - selectedStartDate.getFullYear()) * 12 + (selectedEndDate.getMonth() - selectedStartDate.getMonth());
 
    if (monthDifference !== 11) {
      setSuccessMessage('The duration between start and end date must be 11 months.');
      setEndDate('');
      return;
    }
 
    setEndDate(e.target.value);
  };
 
  return (
    <div className="apply-form-container">
      <h2>Apply for Property</h2>
      <label>
        Start Date:
        <input type="date" value={startDate} onChange={handleStartDateChange} />
      </label>
      <label>
        End Date:
        <input type="date" value={endDate} onChange={handleEndDateChange} />
      </label>
      <button onClick={applyForProperty}>Submit Application</button>
 
      {successMessage && (
        <p className={`form-message ${successMessage.includes('successfully') ? 'success' : 'error'}`}>
          {successMessage}
        </p>
      )}
    </div>
  );
};
 
export default ApplyForm;
 
 