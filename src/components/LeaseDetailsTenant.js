import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LeaseDetailsTenant.scss'; 
import api from '../utils/api'; 

import LeaseRenew from './LeaseRenew';
import LeaseTermination from './LeaseTermination';

const LeaseDetailsTenant = () => {
    const [leases, setLeases] = useState([]);
    const [propertyDetailsMap, setPropertyDetailsMap] = useState(new Map()); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageMessage, setPageMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const [showInlineConfirmation, setShowInlineConfirmation] = useState(false);
    const [leaseToTerminate, setLeaseToTerminate] = useState(null);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const tenantId = user?.userId;
    const jwtToken = localStorage.getItem('jwt');

    const formatAmount = useCallback((amount) => {
        if (amount === null || amount === undefined) {
            return 'N/A';
        }
        const numericAmount = parseFloat(amount);

        if (isNaN(numericAmount)) {
            return 'N/A'; 
        }

        return numericAmount.toFixed(2);
    }, []);

    const fetchAllLeasesAndProperties = useCallback(async (showMessage = true) => {
        setLoading(true);
        setError(null);
        setLeases([]);
        setPropertyDetailsMap(new Map()); 
        if (showMessage) {
            setPageMessage(null);
            setMessageType(null);
        }

        if (!tenantId || !jwtToken) {
            navigate('/login');
            setLoading(false);
            return;
        }

        try {
            const leaseResponse = await api.get(`/v1/lease/${tenantId}`);
            const allLeasesData = leaseResponse.data;

            if (allLeasesData && allLeasesData.length > 0) {
                setLeases(allLeasesData);

                const newPropertyDetailsMap = new Map();
                const fetchPropertyPromises = allLeasesData.map(async (leaseItem) => {
                    if (leaseItem.propertyId) {
                        try {
                            const propertyResponse = await api.get(`/v1/tenant/viewProperty/${leaseItem.propertyId}`);
                            newPropertyDetailsMap.set(leaseItem.propertyId, propertyResponse.data);
                        } catch (propErr) {
                            console.error(`Error fetching property details for Property ID ${leaseItem.propertyId}:`, propErr);
                        }
                    }
                });

                await Promise.all(fetchPropertyPromises);
                setPropertyDetailsMap(newPropertyDetailsMap); 

            } else {
                setLeases([]);
                setPageMessage('You currently have no active leases.');
                setMessageType('info');
            }
        } catch (err) {
            console.error('Error fetching lease details:', err);
            setError(`Failed to load lease details: ${err.response?.data?.message || err.message}`);
            setPageMessage(`Failed to load lease details: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    }, [tenantId, jwtToken, navigate]);

    useEffect(() => {
        fetchAllLeasesAndProperties();
    }, [fetchAllLeasesAndProperties]);

    const handleActionComplete = useCallback((message, type) => {
        setPageMessage(message);
        setMessageType(type);
        fetchAllLeasesAndProperties(false);
    }, [fetchAllLeasesAndProperties]);

    const handleTerminateRequest = useCallback((leaseItem) => {
        setLeaseToTerminate(leaseItem);
        setShowInlineConfirmation(true);
        setPageMessage(null);
        setMessageType(null);
    }, []);

    const handleConfirmTermination = async () => {
        setShowInlineConfirmation(false);
        if (!leaseToTerminate) return;

        setLoading(true);
        setPageMessage(null);
        setMessageType(null);

        try {
            const response = await api.put(`/v1/terminate/${leaseToTerminate.propertyId}`);

            if (response.status === 200) {
                handleActionComplete(`Lease for property at ${leaseToTerminate.propertyAddress} terminated successfully.`, 'success');
            } else {
                const errorMessage = response.data?.message || response.statusText || 'Server Error';
                handleActionComplete(`Failed to terminate lease for ${leaseToTerminate.propertyAddress}: ${errorMessage}`, 'error');
            }
        } catch (err) {
            console.error('Error terminating lease:', err);
            if (err.response) {
                const errorMessage = err.response.data?.message || err.response.statusText || 'Server Error';
                handleActionComplete(`Failed to terminate lease for ${leaseToTerminate.propertyAddress}: ${errorMessage}`, 'error');
            } else {
                handleActionComplete('An error occurred while terminating the lease. Please check your network connection.', 'error');
            }
        } finally {
            setLeaseToTerminate(null);
            setLoading(false);
        }
    };

    const handleCancelTermination = useCallback(() => {
        setShowInlineConfirmation(false);
        setLeaseToTerminate(null);
        setPageMessage('Lease termination cancelled.');
        setMessageType('info');
        fetchAllLeasesAndProperties();
    }, [fetchAllLeasesAndProperties]);

    const handleRenewClick = useCallback((leaseItem) => {
        if (leaseItem && leaseItem.propertyId) {
            if (isLeaseRenewable(leaseItem.endDate)) {
                navigate(`/apply/${leaseItem.propertyId}`);
            } else {
                setPageMessage('The lease cannot be renewed yet. Please wait until the end date.');
                setMessageType('info');
            }
        } else {
            setPageMessage('Error: Could not find property ID for renewal.');
            setMessageType('error');
        }
    }, [navigate]);

    const isLeaseRenewable = (endDateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = endDateString.split('-').map(Number);
        const leaseEndDate = new Date(year, month - 1, day);
        leaseEndDate.setHours(0, 0, 0, 0);

        return today >= leaseEndDate;
    };

    if (loading) return <div className="leaseDetailsContainer">Loading details...</div>;
    if (error) return <div className="leaseDetailsContainer"><p className="errorMessage">{error}</p></div>;

    return (
        <div className="leaseDetailsContainer">
            <h2 className="title">My Leases</h2>

            {pageMessage && (
                <div className={`page-message ${messageType === 'success' ? 'success-message' : messageType === 'error' ? 'error-message' : 'info-message'}`}>
                    {pageMessage}
                </div>
            )}

            {showInlineConfirmation && leaseToTerminate ? (
                <div className="inline-confirmation-box">
                    <p>Are you sure you want to terminate the lease for the property at **{leaseToTerminate.propertyAddress}**? This action cannot be undone.</p>
                    <div className="inline-confirmation-actions">
                        <button className="confirm-button" onClick={handleConfirmTermination}>Yes, Terminate</button>
                        <button className="cancel-button" onClick={handleCancelTermination}>Cancel</button>
                    </div>
                </div>
            ) : (
                leases.length === 0 ? (
                    <div className="no-leases-found">
                        <p>{pageMessage}</p>
                    </div>
                ) : (
                    leases.map((leaseItem) => {
                        const propertyDetails = propertyDetailsMap.get(leaseItem.propertyId);
                        const propertyImageToDisplay = propertyDetails?.image1;
                        const canRenew = isLeaseRenewable(leaseItem.endDate);

                        return (
                            <div key={leaseItem.id || leaseItem.propertyId} className="single-lease-card">
                                <div className="top-section">
                                    <div className="property-image-container">
                                        {propertyImageToDisplay ? (
                                            <img className="property-image" src={`data:image/jpeg;base64,${propertyImageToDisplay}`} alt="Property" />
                                        ) : (
                                            <div className="no-image-placeholder">No Property Image Available</div>
                                        )}
                                    </div>

                                    <div className="property-info-section">
                                        <h4>Property Information</h4>
                                        <p><strong>Address:</strong> {leaseItem.propertyAddress}</p>
                                        <p><strong>Landlord:</strong> {leaseItem.landlordName}</p>
                                        {propertyDetails && (
                                            <>
                                                <p><strong>Property Type:</strong> {propertyDetails.propertyType}</p>
                                                <p><strong>BHK:</strong> {propertyDetails.bhk}</p>
                                                <p><strong>Listed Rent:</strong> {formatAmount(propertyDetails.rentAmount)}</p>
                                                <p><strong>Availability:</strong> {propertyDetails.availabilityStatus}</p>
                                                <p><strong>Description:</strong> {propertyDetails.description}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <hr className="separator" />

                                <div className="lease-details-section">
                                    <h4>Lease Agreement Details</h4>
                                    <p><strong>Tenant Name:</strong> {leaseItem.tenantName}</p>
                                    <p><strong>Start Date:</strong> {leaseItem.startDate}</p>
                                    <p><strong>End Date:</strong> {leaseItem.endDate}</p>
                                    <p><strong>Monthly Rent:</strong> {formatAmount(leaseItem.amount)}</p>
                                </div>

                                <div className="lease-actions">
                                    <LeaseRenew
                                        leaseItem={leaseItem}
                                        onRenewClick={handleRenewClick}
                                        buttonClassName="renew-button"
                                        isRenewable={canRenew}
                                        endDate={leaseItem.endDate}
                                    />
                                    <LeaseTermination
                                        leaseItem={leaseItem}
                                        onTerminateRequest={handleTerminateRequest}
                                        buttonClassName="terminate-button"
                                    />
                                </div>
                                <hr className="separator" />
                            </div>
                        );
                    })
                )
            )}

            <button onClick={() => navigate('/tenanthome')} className="backButton">Back to Dashboard</button>
        </div>
    );
};

export default LeaseDetailsTenant;