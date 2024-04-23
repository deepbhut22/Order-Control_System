import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from "react-redux";

import { backend_url } from '../../App';
import './CitySeach.css'; 

const CustomerSearch = ({fun, fun2}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedItems, setMatchedItems] = useState([]);

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
      if(query === "") setMatchedItems([]);
      else {
        const matched = await axios.get(`${backend_url}/api/orders/searchCustomer?q=${query}`, config);
        setMatchedItems(matched.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemSelect = (item) => {
    setSearchQuery(item);
    onItemSelect(item);
    setMatchedItems([]);
  };

  function onItemSelect(item) {
    const temp = item.split('-')[0].trim();
    fun(temp);
    fun2(item.split('-')[1].trim());
  }

  return (
    <div className="city-search-container"> 
      <input
        className="city-search-input"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for customer..."
      />
      <ul className="city-list"> 
        {matchedItems.map(item => (
          <li 
            key={item.itemId} 
            className="city-item"
            onClick={() => handleItemSelect(item.name + " - " + item.city)}
          >
            {item.name} - {item.city}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerSearch;
