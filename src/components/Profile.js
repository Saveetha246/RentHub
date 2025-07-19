import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.scss";
import { FaUserCircle } from "react-icons/fa"; 
import api from "../utils/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    userId: null,
    password: "",
    role: "",
    mobileNo: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localUserId, setLocalUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Landlord";
      case 2:
        return "Tenant";
      default:
        return "N/A";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("jwt");
    const storedUserId = user?.userId;

    console.log("Retrieved userId from localStorage (useEffect):", storedUserId);
    setLocalUserId(storedUserId);

    if (!storedUserId) {
      console.error("User ID is missing from localStorage!");
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    if (!token) {
      console.error("JWT token is missing from localStorage!");
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get(`/v1/user/viewProfile/${storedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Profile data fetched:", response.data);
        setProfile({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          username: response.data.username || "",
          email: response.data.email || "",
          userId: response.data.userId || storedUserId,
          password: response.data.password || "",
          role: response.data.role || "",
          mobileNo: response.data.mobileNo || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile information.");
        setLoading(false);
        if (error.response) {
          console.error("Backend response:", error.response.data);
          console.error("Backend status:", error.response.status);
        }
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000); 
  };

  const handleSaveClick = () => {
    const token = localStorage.getItem("jwt");
    const currentUserId = profile.userId || localUserId;

    console.log("Saving - currentUserId:", currentUserId);
    console.log("Saving - token:", token);
    console.log("Saving - profile data:", profile);

    if (!currentUserId || !token) {
      setError("User ID or token missing, cannot save.");
      return;
    }

    api
      .put(
        `/v1/user/updateProfile/${currentUserId}`,
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setSuccessMessage("Profile updated successfully!"); 
        clearSuccessMessage(); 
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
        if (error.response) {
          console.error("Backend response:", error.response.data);
          console.error("Backend status:", error.response.status);
        }
      });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <FaUserCircle className="profile-icon-heading" />
        <h2 className="loading-text">Loading Profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <FaUserCircle className="profile-icon-heading" />
        <h2 className="error-text">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <FaUserCircle className="profile-icon-heading" />
      {successMessage && <p className="success-message">{successMessage}</p>} {}
      {isEditing ? (
        <div className="profile-form">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
          />
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
          <label htmlFor="email">Email ID:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
          />
          <label htmlFor="role">Role:</label>
          <input
            id="role"
            type="text"
            name="role"
            value={getRoleName(profile.role)}
            onChange={handleChange}
            disabled
          />
          <label htmlFor="mobileNo">Mobile Number:</label>
          <input
            id="mobileNo"
            type="text"
            name="mobileNo"
            value={profile.mobileNo}
            onChange={handleChange}
          />
          <div className="buttons">
            <button type="button" onClick={handleSaveClick}>
              Save Changes
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-details">
          <span className="label">First Name:</span>
          <span className="description-value">{profile.firstName || "N/A"}</span>
          <span className="label">Last Name:</span>
          <span className="description-value">{profile.lastName || "N/A"}</span>
          <span className="label">Username:</span>
          <span className="description-value">{profile.username || "N/A"}</span>
          <span className="label">Email ID:</span>
          <span className="description-value">{profile.email || "N/A"}</span>
          <span className="label">Role:</span>
          <span className="description-value">{getRoleName(profile.role)}</span>
          <span className="label">Mobile Number:</span>
          <span className="description-value">{profile.mobileNo || "N/A"}</span>
          <div className="buttons">
            <button type="button" onClick={handleEditClick}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
