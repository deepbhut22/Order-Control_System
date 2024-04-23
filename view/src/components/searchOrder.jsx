import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from "react-redux";

import { backend_url } from '../App';
// import './CitySeach.css'; 

const OrderSearch = ({fun}) => {
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
        if(query === "") setMatchedItems([])
        else {
            const matched = await axios.get(`${backend_url}/api/orders/search?q=${query}`, config);
            setMatchedItems(matched.data);
        }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemSelect = (item) => {
    setSearchQuery("Order id : " + item?._id);
    onItemSelect(item);
    setMatchedItems([]);
  };

  function onItemSelect(item) {
    fun(item);
  }

  return (
    <div className="city-search-container"> 
      <input
        className="city-search-input"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search for an item"
      />
      <ul className="city-list"> 
        {matchedItems.map(item => (
          <li 
            key={item?._id} 
            className="city-item"
            onClick={() => handleItemSelect(item)}
          >
            {item?._id} - {item?.isDelivered ? "delivered" : "not delivered yet"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSearch;
