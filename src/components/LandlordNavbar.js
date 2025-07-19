import React, { useState, useEffect } from "react";
import { FaHome, FaBell, FaUser, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import axios from "axios"; 
import styles from "../styles/LandlordNavbar.module.scss";
import { useNavigate } from "react-router-dom"; 
import api from "../utils/api";



const LandlordHome = () => {
  const [showProfile, setShowProfile] = useState(false); 
  const [profileData, setProfileData] = useState(null); 
  const navigate = useNavigate();
  const handleProfileIconClick = () => {
    navigate("/landlord/profile");  
  };

  useEffect(() => {
    if (showProfile) {
      const userId = localStorage.getItem("userId"); 

      api
        .get(`/v1/user/viewProfile/${userId}`)
        .then((response) => {
          setProfileData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [showProfile]);
  

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <NavLink to="/landlord/properties" className={styles.logoLink}>
            <FaHome className={styles.houseIcon} />
            <span className={styles.logoText}>RentHUB</span>
          </NavLink>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/landlord/add-property" className={styles.addProperty}>
              <FaPlus className={styles.addIcon} /> Add Property
            </NavLink>
          </li>
          
          <li>
            <button className={styles.iconButton} onClick={handleProfileIconClick} title="View Profile">
              <FaUser className={styles.profileIcon} />
            </button>
          </li>
        </ul>
      </nav>


      {showProfile && profileData && (
  <div className="profile-container">
    <h2>My Profile</h2>
    <p><strong>First Name:</strong> {profileData.firstName}</p>
    <p><strong>Last Name:</strong> {profileData.lastName}</p>
    <p><strong>Username:</strong> {profileData.username}</p>
    <p><strong>Email ID:</strong> {profileData.emailId}</p>
    <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
  </div>
)}

    </div>
  );
};

export default LandlordHome;