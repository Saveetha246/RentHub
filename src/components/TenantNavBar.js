import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaBell, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/TenantNavbar.module.scss'; 
import {logout} from '../utils/auth';

const TenantNavbar = () => {

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const handleLogOut = () =>{
    logout();
  }

  const handleProfileIconClick = () => {

    navigate('/tenant/profile');

    setIsMenuOpen(false); 

  };
 
  const toggleMenu = () => {

    setIsMenuOpen(!isMenuOpen);

  };
 

  const handleClickOutside = (event) => {

    if (
      isMenuOpen &&
      dropdownMenuRef.current &&
      !dropdownMenuRef.current.contains(event.target) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }

  };
 
 

  useEffect(() => {

    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, [isMenuOpen]); 
 
  return (
<nav className={styles.navbar}>

   
<div className={styles.logoContainer}>
<NavLink to="/tenanthome" className={styles.logoLink}>
<FaHome className={styles.houseIcon} />
<span className={styles.logoText}>RentHUB</span>
</NavLink>
</div>
 
     
<ul className={styles.navLinks}>

       
<li className={styles.searchPropertyLink}> 
<NavLink to="/tenanthome" className={styles.searchProperty} onClick={() => setIsMenuOpen(false)}>
<FaSearch className={styles.searchIcon} /> Search Property
</NavLink>
</li>

    


    
<li className={styles.profileLink}> 
<button

            className={styles.iconButton}

            onClick={handleProfileIconClick}

            title="View Profile"

            aria-label="View Profile"
>
<FaUser className={styles.profileIcon} />
</button>
</li>

       
<li className={styles.dropdown}> 
<button

            className={styles.hamburgerButton}

            onClick={toggleMenu}

            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}

            ref={menuButtonRef} 
>

            {isMenuOpen ? <FaTimes /> : <FaBars />}
</button>
 
        

          {isMenuOpen && (
<ul className={styles.dropdownMenu} ref={dropdownMenuRef}>
<li>
<NavLink to="/Tenant/my-rentals" className={({ isActive }) => (isActive ? styles.active : '')}>My Rentals</NavLink>
</li>
<li>
<NavLink to="/Tenant/applications" className={({ isActive }) => (isActive ? styles.active : '')}>Applications status</NavLink>
</li>
<li>
<NavLink to="/Tenant/payment-history" className={({ isActive }) => (isActive ? styles.active : '')}>Payment History</NavLink>
</li>
<li>
<NavLink to="/Tenant/lease-details" className={({ isActive }) => (isActive ? styles.active : '')}>Lease Details</NavLink>
</li>

<li>

<li>
  <NavLink
    to="/tenant/raise-request" 
    className={({ isActive }) => (isActive ? styles.active : '')}
  >
    Raise Ticket
  </NavLink>
</li>
<li>
              <NavLink
                to="/Tenant/maintenance-history"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Maintenance History
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? styles.active : '')} onClick={handleLogOut}
              >
                Logout
              </NavLink>
            </li>
<li>
  

</li>
</li>
</ul>

          )}
</li>
</ul>
</nav>

  );

};
 
export default TenantNavbar;
 