import React from 'react';
import '../styles/WhyChooseRentHub.scss';
import { FaGlobe, FaHandshake, FaClipboardList } from 'react-icons/fa';

const steps = [
  {
    icon: <FaGlobe />,
    title: 'Rent from Anywhere',
    description: 'rent properties from anywhere, no physical contact needed.',
  },
  {
    icon: <FaHandshake />,
    title: 'No Physical Contact',
    description: 'Connect easily through our website.',
  },
  {
    icon: <FaClipboardList />,
    title: 'Easy Property Listing & Lease Agreements',
    description: 'Landlords can list rentals effortlessly and manage leases with simple, digital agreements.',
  },
];

const WhyChooseRentHub = ({ layout = 'vertical' }) => {
  return (
    <div className={`why-choose-rent-hub ${layout}`}>
      <h2>Why Choose Rent Hub?</h2>
      <p className="intro">We're revolutionizing the rental experience with innovative technology and exceptional service.</p>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className="step">
            <div className="icon">{step.icon}</div>
            <div className="info">
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseRentHub;