import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styles from '../styles/LandlordLayout.module.scss';
import LandlordHome from '../components/LandlordNavbar.js';
import LandlordFooter from '../components/LandlordFooter.js'
import {logout} from '../utils/auth';
 
const handleLogout = () => {
 logout();
};

function LandlordLayout() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <LandlordHome />
      </header>
 
      <div className={styles.contentWrapper}>
        <nav className={styles.sidebar}>
          <ul className={styles.sidebarMenu}>
            <li>
              <NavLink to="/landlord/properties" className={({ isActive }) => (isActive ? styles.active : '')}>My Properties</NavLink>
            </li>
            <li>
              <NavLink to="/landlord/applications" className={({ isActive }) => (isActive ? styles.active : '')}>Applications </NavLink>
            </li>
            <li>
              <NavLink to="/landlord/payment-history" className={({ isActive }) => (isActive ? styles.active : '')}>Payment History</NavLink>
            </li>
            <li>
              <NavLink to="/landlord/maintenance" className={({ isActive }) => (isActive ? styles.active : '')}>Maintenance</NavLink>
            </li>
            <li>
            <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
 
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
      <div>
        <footer className={styles.footer}>
         <LandlordFooter/>

        </footer>
      </div>
    </div>
  );
}
 
export default LandlordLayout;