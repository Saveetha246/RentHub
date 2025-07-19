import React from 'react';
import '../styles/HowRentHubWorks.scss';
 
const HowRentHubWorks = () => {
  return (
    <div className="how-it-works-card">
      <h2 className="title">How RentHUB Works</h2>
      <p className="subtitle">Effortless renting and listing in three simple steps.</p>
      <div className="steps-card">
        <div className="step-card">
          <div className="number-circle-card">1</div>
          <div className="description-card">
            <h3 className="step-title">Find or List</h3>
            <p className="step-text">Search properties or list your units with detailed info.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="number-circle-card">2</div>
          <div className="description-card">
            <h3 className="step-title">Connect</h3>
            <p className="step-text">Direct communication between tenants and landlords made easy.</p>
          </div>
        </div>
        <div className="step-card">
          <div className="number-circle-card">3</div>
          <div className="description-card">
            <h3 className="step-title">Complete Rental</h3>
            <p className="step-text">Securely finalize agreements, payments, and documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default HowRentHubWorks;