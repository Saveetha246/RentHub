import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import  '../styles/Footer.scss';

const FooterTenant = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="section">
          <h3 ><FontAwesomeIcon icon={faHouse} className="iconHouse" /> RentHUB - For Tenants</h3>
          <p>Your journey to a perfect rental starts here.</p>
        </div>
        <div className="section">
          <h4>Your Resources</h4>
          <ul>
            <li><NavLink to="/tenanthome">Search Properties</NavLink></li>
            {}
            <li><NavLink to="/Tenant/applications">Application Status</NavLink></li>
            
          </ul>
        </div>
        <div className="section">
          <h4>Contact Us</h4>
          <p><FontAwesomeIcon icon={faLocationDot} className="icon" /> 123 Market St, San Francisco, CA 94103</p>
          <p><FontAwesomeIcon icon={faPhone} className="icon" /> +1 (555) 123-4567</p>
          <p><a href="mailto:info@renthub.com"><FontAwesomeIcon icon={faEnvelope} className="icon" /> info@renthub.com</a></p>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} RentHUB. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterTenant;