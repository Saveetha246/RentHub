import React from 'react';
import  '../styles/Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const FooterLandlord = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="section">
          <h3><FontAwesomeIcon icon={faHouse} className="iconHouse" /> RentHUB - For Landlords</h3>
          <p>Simplify your property management and find great tenants.</p>
        </div>
        <div className="section">
          <h4>Your Tools</h4>
          <ul>
            <li><NavLink to="/landlord/listings">My Listings</NavLink></li>
            <li><NavLink href="/landlord/applications">Tenant Applications</NavLink></li>
          </ul>
        </div>
        <div className="section">
          <h4>Contact Us</h4>
          <p><FontAwesomeIcon icon={faLocationDot} className="icon" /> 123 Market St, San Francisco, CA 94103</p>
          <p><FontAwesomeIcon icon={faPhone} className="icon"  /> +1 (555) 123-4567</p>
          <p><a href="mailto:info@renthub.com"><FontAwesomeIcon icon={faEnvelope} className="icon"  /> info@renthub.com</a></p>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} RentHUB. All rights reserved. 
      </div>
    </footer>
  );
};

export default FooterLandlord;