import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeliveryVehicles,
  createDeliveryVehicle,
} from "../../store/actions/deliveryVehicleActions";
import CitySearch from "../../components/search_vehicle/searchCity";
import { backend_url } from "../../App";
import axios from "axios";

const DeliveryVehicleListPage = () => {




  const [vehicle, set_Vehicle] = useState("");
  const [vehicleData, setVehicleData] = useState({});



  const dispatch = useDispatch();
  const { deliveryVehicles, error } = useSelector(
    (store) => store.deliveryVehicleReducer
  );

  const { token } = useSelector((store) => store.authReducer);

  const [newVehicleData, setNewVehicleData] = useState({
    city: "",
    vehicleType: "",
    registrationNumber: "",
  });

  useEffect(() => {
    dispatch(fetchDeliveryVehicles(token));
  }, []);

  const handleCreateVehicle = () => {
    dispatch(createDeliveryVehicle(newVehicleData, token));
    setNewVehicleData({
      city: "",
      vehicleType: "",
      registrationNumber: "",
    });
  };

  const deleteVehicle = (vehicle) => {

  }

  async function findVehicle(name) {
    const config = {
      headers: {
        Authorization: token, // Include the token in the Authorization header
      },
    };
    try {
      const response = await axios.get(
        `${backend_url}/api/delivery-vehicles/findOne?q=${name}`,
        config
      );
      console.log(response);
      setVehicleData(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    findVehicle(vehicle);
  },[vehicle]);

  return (
    <div className="delivery-vehicle-list-container">
      <h1 className="login-heading">Delivery Vehicle List Page</h1>

      {/* Add New Vehicle Form */}
      <div className="add-vehicle-form">
        <h2>Add New Vehicle</h2>
        <div className="form-group-delivery">
          <label className="form-label-delivery">City:</label>
          <input
            type="text"
            value={newVehicleData.city}
            onChange={(e) =>
              setNewVehicleData({ ...newVehicleData, city: e.target.value })
            }
            className="form-input-delivery"
          />
        </div>
        <div className="form-group-delivery">
          <label className="form-label-delivery">Vehicle Type:</label>
          <select
            value={newVehicleData.vehicleType}
            onChange={(e) =>
              setNewVehicleData({
                ...newVehicleData,
                vehicleType: e.target.value,
              })
            }
            className="form-input-delivery"
          >
            <option value="">Select Vehicle</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
            <option value="container">container</option>
            <option value="mini-truck">mini-truck</option>
            <option value="midsized-truck">midsized-truck</option>
            <option value="dumper">dumper</option>
            <option value="large-truck">large-truck</option>
          </select>
        </div>
        <div className="form-group-delivery">
          <label className="form-label-delivery">Registration No.:</label>
          <input
            type="text"
            value={newVehicleData.registrationNumber}
            onChange={(e) =>
              setNewVehicleData({
                ...newVehicleData,
                registrationNumber: e.target.value.toUpperCase(),
              })
            }
            className="form-input-delivery"
          />
      </div>
      <button onClick={handleCreateVehicle} className="create-vehicle-button">
          Create Vehicle
      </button>

      {/* City Search Component */}
      <CitySearch fun={set_Vehicle} />

      {/* Searched Vehicle Details */}
      {vehicleData && (
        <div className="searched-vehicle">
          <h3>Search Result</h3>
          <div className="vehicle-details">
            <span>Vehicle ID: {vehicleData._id}</span>
            <span>City: {vehicleData.city}</span>
            <span>Active Orders: {vehicleData.activeOrdersCount}</span>
            <span>Vehicle Type: {vehicleData.vehicleType}</span>
            <span>Registration No.: {vehicleData.registrationNumber}</span>
          </div>
          <br/><br/>
        </div>
      )}

      {/* List of Delivery Vehicles */}
      <div className="vehicle-list">
        {deliveryVehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-item">
            <span>Vehicle ID: {vehicle._id}</span>
            <span>City: {vehicle.city}</span>
            <span>Active Orders: {vehicle.activeOrdersCount}</span>
            <span>Vehicle Type: {vehicle.vehicleType}</span>
            <span>Registration No.: {vehicle.registrationNumber}</span>
          </div>
        ))}
      </div>

      <div className="error-message">{error != null && <>{error} </>}</div>
    </div>
    </div>
  );
};

export default DeliveryVehicleListPage;
