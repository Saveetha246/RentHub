import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import '../styles/SignUp.scss'; 

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    role: 2,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value === "landlord" ? 1 : 2 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    
    const mobileNumberPattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!mobileNumberPattern.test(formData.mobileNo)) {
      setError("Mobile number must be 10 digits.");
      return;
    }

    if (!passwordPattern.test(formData.password)) {
      setError("Password must be at least 8 characters long, contain 1 uppercase letter, and 1 special character.");
      return;
    }

    try {
      const formattedData = { ...formData, mobileNo: Number(formData.mobileNo) };
      const response = await api.post("/v1/public/register", formattedData);

      if (response.status === 200) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Signup failed. Try again!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>Rent, List, Connect - Sign up with RentHub!</h2>
      </div>
      <div className="signup-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select onChange={handleRoleChange}>
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-links">
          Already have an account? <a onClick={() => navigate("/login")}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
