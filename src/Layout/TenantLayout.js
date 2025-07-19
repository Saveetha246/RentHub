

import React from 'react';

import { Outlet } from 'react-router-dom';

import TenantNavbar from '../components/TenantNavBar.js'; 

import TenantFooter from '../components/TenantFooter.js'; 

import styles from '../styles/TenantLayout.module.scss'; 
 
function TenantLayout() {

  return (
<div className={styles.appContainer}>
<header className={styles.header}>
<TenantNavbar />
</header>
 
      <div className={styles.contentWrapper}>
<main className={styles.mainContent}>
<Outlet />
</main>
</div>
 
<div>
<footer className={styles.footer}>
<TenantFooter />
</footer>
</div>
</div>

  );

}
 
export default TenantLayout;
 