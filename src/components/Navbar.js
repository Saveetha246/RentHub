import React, { useState } from 'react';
import { FaHome, FaAngleDown } from 'react-icons/fa';
import styles from '../styles/Navbar.module.scss';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ scrollToHowItWorks }) => {
  const [isLandlordOpen, setIsLandlordOpen] = useState(false);
  const [isTenantOpen, setIsTenantOpen] = useState(false);

  const toggleLandlordDropdown = () => {
    setIsLandlordOpen(!isLandlordOpen);
    setIsTenantOpen(false);
  };

  const toggleTenantDropdown = () => {
    setIsTenantOpen(!isTenantOpen);
    setIsLandlordOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <FaHome className={styles.houseIcon} />
        <span className={styles.logoText}>RentHUB</span>
      </div>

      <ul className={styles.navLinks}>
      <li>
          <a href="/login">Login</a> 
        </li>
        <li className={styles.dropdown}>
            
          <button className={styles.dropdownToggle} onClick={toggleLandlordDropdown}>
            Landlord <FaAngleDown className={`${styles.dropdownIcon} ${isLandlordOpen ? styles.rotate : ''}`} />
          </button>
    
          {isLandlordOpen && (
            <ul className={styles.dropdownMenu}>
              <li><a href="/signup?role=landlord">Sign Up</a></li>
              <li><a href="/login">Post Property</a></li>
            </ul>
          )}
        </li>
        <li className={styles.dropdown}>
          <button className={styles.dropdownToggle} onClick={toggleTenantDropdown}>
            Tenant <FaAngleDown className={`${styles.dropdownIcon} ${isTenantOpen ? styles.rotate : ''}`} />
          </button>
          {isTenantOpen && (
            <ul className={styles.dropdownMenu}>
              <li><a href="/signup?role=tenant">Sign Up</a></li>
              <li><a href="/login">Search Property</a></li>
            </ul>
          )}
        </li>
        <li>
          
          <a onClick={scrollToHowItWorks}>How it works</a>



        </li>
        
      </ul>
    </nav>
  );
};

export default Navbar;