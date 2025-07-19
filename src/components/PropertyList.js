import React, { useEffect, useState } from 'react';
import PropertyCards from './PropertyCards';
import '../styles/PropertyList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import api from '../utils/api';


const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bhk: '',
    keyword: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    api.get('/v1/tenant/viewProperties/')
      .then(response => {
        console.log('Fetched properties:', response.data);
        setProperties(response.data);
      })
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchFilters({ ...searchFilters, [name]: name === "bhk" ? value.toString() : value });
  };

  const applyFilters = () => {
    setAppliedFilters(searchFilters);
  };

  const resetFilters = () => {
    const initialFilters = {
      city: '',
      minPrice: '',
      maxPrice: '',
      bhk: '',
      keyword: ''
    };
    setSearchFilters(initialFilters);
    setAppliedFilters({});
  };

  const filterProperties = () => {
    return properties.filter((prop) =>
      (!appliedFilters.city || prop.address.city.toLowerCase().includes(appliedFilters.city.toLowerCase())) &&
      (!appliedFilters.minPrice || prop.rentAmount >= parseInt(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || prop.rentAmount <= parseInt(appliedFilters.maxPrice)) &&
      (!appliedFilters.bhk || prop.bhk === appliedFilters.bhk) &&
      (!appliedFilters.keyword || prop.propertyType.toLowerCase().includes(appliedFilters.keyword.toLowerCase()))
    );
  };

  return (
    <div className="property-container">
    
      <div className="search-bar">
        <input
          type="text"
          name="city"
          placeholder="Enter city"
          className='filters'
          value={searchFilters.city}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="minPrice"
          placeholder="Min Price"
          className='filters'
           pattern="^\d+(\.\d{1,2})?$"
          value={searchFilters.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="maxPrice"
          placeholder="Max Price"
          className='filters'
           pattern="^\d+(\.\d{1,2})?$"
          value={searchFilters.maxPrice}
          onChange={handleInputChange}
        />
        <select name="bhk" value={searchFilters.bhk} className='filters' onChange={handleInputChange}>
          <option value="">Select BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="4BHK">4 BHK</option>
        </select>
        <input
          type="text"
          name="keyword"
          placeholder="Search property type..."
          value={searchFilters.keyword}
          onChange={handleInputChange}
        />
        <button onClick={applyFilters}>Search</button>
        <button onClick={resetFilters} title="Refresh Filters">
  <FontAwesomeIcon icon={faSyncAlt} />
</button>

      </div>


      <div className="property-list">
        {filterProperties().length === 0 ? (
          <p>No properties found or still loading...</p>
        ) : (
          filterProperties().map((prop) => (
            <PropertyCards
              key={prop.propertyId}
              propertyId={prop.propertyId}
              label={prop.availabilityStatus === 'Available' ? 'Available' : 'Rented'}
              price={`₹${prop.rentAmount}`}
              title={`${prop.propertyType} - ${prop.bhk}`}
              location={`${prop.address.city}, ${prop.address.state}`}
              image={`data:image/jpeg;base64,${prop.image1}`}
              buttonText="View Details"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;
