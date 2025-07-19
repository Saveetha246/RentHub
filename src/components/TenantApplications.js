import React from 'react';
import ApplicationCard from '../components/ApplicationCard';
import { getUserId } from '../utils/auth';

const TenantApplications = () => {
  const userId = getUserId();

  return (
    <div>
      
      {userId ? (
        <ApplicationCard userId={userId} />
      ) : (
        <p>User not logged in. Please log in to view applications.</p>
      )}
    </div>
  );
};

export default TenantApplications;
