import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const FooterPublic = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="section">
          <h3><FontAwesomeIcon icon={faHouse} className="iconHouse" /> RentHUB</h3>
          <p>RentHUB is revolutionizing the rental property market by connecting tenants and landlords through our innovative platform.</p>
        </div>
        <div className="section">
          <h4>Quick Links</h4>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/how-it-works">How It Works</NavLink></li>
            <li><NavLink to="/login">Browse Properties</NavLink></li>
            <li><NavLink to="/login">List Your Property</NavLink></li>
          </ul>
        </div>
        <div className="section">
          <h4>Contact Us</h4>
          <p><FontAwesomeIcon icon={faLocationDot} className="icon" /> 123 Market St, San Francisco, CA 94103</p>
          <p><FontAwesomeIcon icon={faPhone} className="icon" /> +1 (555) 123-4567</p>
          <p><NavLink to="mailto:info@renthub.com"><FontAwesomeIcon icon={faEnvelope} className="icon" /> info@renthub.com</NavLink></p>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} RentHUB. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterPublic;
