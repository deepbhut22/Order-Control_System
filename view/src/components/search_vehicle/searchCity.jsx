import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from "react-redux";

import { backend_url } from '../../App';
import './CitySeach.css'; // Import your CSS file

const CitySearch = ({ fun }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedCities, setMatchedCities] = useState([]);

  const { token } = useSelector((store) => store.authReducer);

  const handleInputChange = async (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const config = {
        headers: {
          Authorization: token,
        },
      };

    try {
      if (query === "") setMatchedCities([]);
      else {
        const matched = await axios.get(`${backend_url}/api/orders/searchVehicle?q=${query}`, config);
        setMatchedCities(matched.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCitySelect = (city) => {
    const temp = city.split('-')[0].trim();
    setSearchQuery(city);
    fun(temp);
    setMatchedCities([]);
  };

  return (
    <div className="city-search-container">
      <input
        className="city-search-input"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for a city..."
      />
      <ul className="city-list" style={{maxHeight:"400px",overflow:"scroll"}}>
        {matchedCities.map(city => (
          <li 
            key={city.registrationNumber} 
            className="city-item"
            onClick={() => handleCitySelect(city.registrationNumber + "-" + city.vehicleType)}
          >
            {city.registrationNumber} - {city.vehicleType}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitySearch;
