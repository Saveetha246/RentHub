import React from 'react';
import '../styles/LeaseTermination.scss';

const LeaseTermination = ({ leaseItem, onTerminateRequest, buttonClassName }) => {
    const handleButtonClick = () => {
        
        onTerminateRequest(leaseItem); 
    };

    return (
        <button onClick={handleButtonClick} className={buttonClassName}>
            Terminate Lease
        </button>
    );
};

export default LeaseTermination;