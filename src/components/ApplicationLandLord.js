import React, { useState, useEffect } from 'react';
import styles from '../styles/ApplicationLandLord.module.scss';
import api from '../utils/api';
 
const Application = () => {
    const [properties, setProperties] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [landlordId, setLandlordId] = useState(null);
    const authToken = localStorage.getItem('authToken');
 
    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                setLandlordId(userData.userId);
            } catch (err) {
                setError('Failed to parse user data.');
                setLoading(false);
            }
        } else {
            setError('User not logged in.');
            setLoading(false);
        }
    }, []);
 
    useEffect(() => {
        if (landlordId) {
            const fetchData = async () => {
                try {
                    const [propertyRes, transactionRes] = await Promise.all([
                        api.get(`/v1/landlord/properties/${landlordId}`, {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }),
                        api.get(`/v1/landlord/properties/transaction/${landlordId}`, {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }),
                    ]);
                    setProperties(propertyRes.data);
                    setTransactions(transactionRes.data);
                } catch (err) {
                    setError('Failed to fetch data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [landlordId, authToken]);
 
    const handleUpdateStatus = async (transactionId, newStatus) => {
        try {
            const response = await api.patch(
                `/v1/landlord/properties/updateStatus/${transactionId}/${newStatus}`,
                {},
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            if (response.status === 200) {
                setTransactions((prev) =>
                    prev.map((t) =>
                        t.transactionId === transactionId ? { ...t, status: newStatus } : t
                    )
                );
            } else {
                setError('Failed to update status.');
            }
        } catch (err) {
            setError('Error updating status.');
        }
    };
 
    const transactionsWithProperties = transactions.map((transaction) => {
        const property = properties.find(
            (prop) => String(prop.propertyId) === String(transaction.propertyId)
        );
        return { ...transaction, property };
    });
 
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
 
    return (
        <div className={styles['application-container']}>
            <h2>All Applications Received</h2>
            {transactionsWithProperties.length > 0 ? (
                <ul className={styles['application-list']}>
                    {transactionsWithProperties.map((item) => (
                        <li key={item.transactionId} className={styles['application-item']}>
                            {}
                            <div className={styles['left-column']}>
                                {item.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${item.image}`}
                                        alt={`Property ${item.propertyId}`}
                                        className={styles['property-image']}
                                    />
                                )}
                            </div>
 
                            {}
                            <div className={styles['property-details-wrapper']}>
                                <div className={styles['property-details']}>
                                    {item.property?.address && typeof item.property.address === 'object' ? (
                                        <>
                                            <p><strong>Street:</strong> {item.property.address.streetName}</p>
                                            <p><strong>City:</strong> {item.property.address.city}</p>
                                        </>
                                    ) : (
                                        <p><strong>Address:</strong> {item.address}</p>
                                    )}
                                    <p><strong>Tenant:</strong> {item.userName}</p>
                                    <p><strong>Status:</strong> {item.status}</p>
                                    <p><strong>Duration:</strong> {item.startDate} to {item.endDate}</p>
                                </div>
 
                                {item.status === 'Applied' && (
                                    <div className={styles['property-actions']}>
                                        <button onClick={() => handleUpdateStatus(item.transactionId, 'Accepted')}>Accept</button>
                                        <button onClick={() => handleUpdateStatus(item.transactionId, 'Rejected')}>Reject</button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No applications received yet.</p>
            )}
        </div>
    );
};
 
export default Application;
 