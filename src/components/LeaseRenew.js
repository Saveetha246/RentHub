import React from 'react';
 
const LeaseRenew = ({ leaseItem, onRenewClick, buttonClassName, isRenewable, endDate }) => {

    const tooltipMessage = isRenewable

        ? "Click to renew your lease"

        : `The lease can be renewed on or after this date: ${endDate}`;
 
    return (
        <button
            className={buttonClassName}
            onClick={() => onRenewClick(leaseItem)}
            disabled={!isRenewable}
            title={tooltipMessage}>Renew Lease
        </button>

    );

};
 
export default LeaseRenew;
 