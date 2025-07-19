import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/PropertyCards.scss';

const PropertyCards = ({ propertyId, label, price, title, location, image, buttonText }) => {
  const navigate = useNavigate();

  return (
    <div className="property-card">
      {label && <div className="property-label">{label}</div>}
      {image && <img src={image} alt={title} className="property-image" />}

      <div className="property-title">{title}</div>
      <div className="property-location">
        <FaMapMarkerAlt className="location-icon" />
        {location}
      </div>
      <div className="property-price">
        {price} <span>/month</span>
      </div>

      <button
        className="property-button"
        onClick={() => navigate(`/property/${propertyId}`)}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PropertyCards;
