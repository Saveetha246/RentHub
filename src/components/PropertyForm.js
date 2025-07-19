import React, { useState } from "react";
import "../styles/PropertyForm.scss";

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    propertyType: "",
    bhk: "",
    rentAmount: "",
    availabilityStatus: "",
    description: "",
    address: {
      streetName: "",
      city: "",
      state: "",
      pinCode: "",
    },
    propertyImage: null,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        propertyImage: file,
      }));
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        propertyImage: null,
      }));
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.propertyImage) {
      setMessage({ type: "error", text: "Please select an image to upload." });
      return;
    }

    const trimmedAvailabilityStatus = formData.availabilityStatus.trim();
    if (!trimmedAvailabilityStatus) {
      setMessage({ type: "error", text: "Please select an availability status (e.g., Available, Rented)." });
      return;
    }

    const propertyRequestDto = {
      propertyType: formData.propertyType.trim(),
      bhk: formData.bhk.trim(),
      rentAmount: parseFloat(formData.rentAmount),
      description: formData.description.trim(),
      address: {
        streetName: formData.address.streetName.trim(),
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        pinCode: formData.address.pinCode.trim(),
      },
      availabilityStatus: trimmedAvailabilityStatus,
    };

    const dataToSend = new FormData();
    dataToSend.append(
      "propertyRequestDto",
      new Blob([JSON.stringify(propertyRequestDto)], { type: "application/json" })
    );

    console.log("Sent Data to API:", JSON.stringify(propertyRequestDto, null, 2));

    dataToSend.append("image", formData.propertyImage);

    try {
      const response = await fetch("http://localhost:8090/api/v1/landlord/properties", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        body: dataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Property added successfully:", result);
        setMessage({ type: "success", text: "Property listed successfully!" });

        setFormData({
          propertyType: "",
          bhk: "",
          rentAmount: "",
          availabilityStatus: "",
          description: "",
          address: {
            streetName: "",
            city: "",
            state: "",
            pinCode: "",
          },
          propertyImage: null,
        });
        setImagePreviewUrl(null);
      } else {
        const errorText = await response.text();
        console.error("Error adding property:", response.status, errorText);
        setMessage({ type: "error", text: `Error listing property: ${errorText}` });
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      setMessage({ type: "error", text: "Could not connect to the server. Please ensure the backend is running." });
    }
  };

  return (
    <div className="propertyFormContainer">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit} className="propertyForm">
        <div className="form-fields">
          <div className="formGroup">
            <label htmlFor="propertyType">Property Type:</label>
            <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required>
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="bhk">BHK:</label>
            <select id="bhk" name="bhk" value={formData.bhk} onChange={handleChange} required>
              <option value="">Select BHK</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="rentAmount">Rent Amount:</label>
            <input type="text" id="rentAmount" name="rentAmount" value={formData.rentAmount} onChange={handleChange}  pattern="^\d+(\.\d{1,2})?$" required />
          </div>

          <div className="formGroup">
            <label htmlFor="availabilityStatus">Availability Status:</label>
            <select id="availabilityStatus" name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} required>
              <option value="">Select Availability Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          <div className="formGroup description-full-width">
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
          </div>

          <fieldset className="addressSection">
            <legend>Address Details</legend>
            <div className="formGroup">
              <label htmlFor="streetName">Street Name:</label>
              <input type="text" id="streetName" name="address.streetName" value={formData.address.streetName} onChange={handleChange} required />
            </div>
            <div className="formGroup">
              <label htmlFor="city">City:</label>
              <input type="text" id="city" name="address.city" value={formData.address.city} onChange={handleChange} required />
            </div>
            <div className="formGroup">
              <label htmlFor="state">State:</label>
              <input type="text" id="state" name="address.state" value={formData.address.state} onChange={handleChange} required />
            </div>
            <div className="formGroup">
              <label htmlFor="pinCode">Pin Code:</label>
              <input type="text" id="pinCode" name="address.pinCode" value={formData.address.pinCode} onChange={handleChange} required />
            </div>
          </fieldset>

          <div className="formGroup image-full-width">
            <label htmlFor="propertyImage">Property Image:</label>
            <input type="file" id="propertyImage" name="propertyImage" accept="image/*" onChange={handleImageChange} required />
            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Property Preview" className="image-preview" />}
          </div>
        </div>

        <button type="submit" className="submitButton">Add Property</button>
        {message.text && (
          <p className={`form-message ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default PropertyForm;
