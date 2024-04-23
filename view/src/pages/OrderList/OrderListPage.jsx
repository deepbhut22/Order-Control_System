import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  markOrderDelivered,
  createOrder,
} from "../../store/actions/orderActions";
import { fetchCustomers } from "../../store/actions/customerActions";
import { fetchDeliveryVehicles } from "../../store/actions/deliveryVehicleActions";
import CitySearch from "../../components/search_vehicle/searchCity";
import IteamSearch from "../../components/search_vehicle/searchItem";
import CustomerSearch from "../../components/search_vehicle/searchCustomer";
import './styles.css';
import OrderSearch from "../../components/searchOrder";


const OrderListPage = () => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((store) => store.orderReducer);

  const { token } = useSelector((store) => store.authReducer);

  const [deliveryLocation, setDeliveryLocation] = useState(""); // State for delivery location
  const [vehicle, set_Vehicle] = useState("");
  const [ITEM, SETITEM] = useState("");
  const [CUSTOMER, SETCUSTOMER] = useState("");
  const [totalPrice, setToalPrice] = useState(Number);
  const [order, setOrder] = useState({});

  useEffect(() => {
    dispatch(fetchOrders(token));
    dispatch(fetchCustomers(token)); // Fetch customers
    dispatch(fetchDeliveryVehicles(token)); // Fetch delivery vehicles
  }, [dispatch, token]);

  const handleMarkDelivered = (orderId) => {
    dispatch(markOrderDelivered(orderId, token));
  };

  const handleCreateOrder = () => {

      const orderNumber = generateUniqueOrderNumber();

      const orderData = {
        itemId: ITEM,
        customerId: CUSTOMER,
        deliveryVehicleId: vehicle,
        orderNumber: orderNumber, // Assign order number
        deliveryLocation: deliveryLocation, // Assign delivery location
        totalPrice: calculateTotalPrice(totalPrice), // Calculate total price based on item
      };
      console.log(orderData);
      dispatch(createOrder(orderData, token));
    // }
  };

  const generateUniqueOrderNumber = () => {

    const currentDate = new Date();
    const randomNumber = Math.floor(Math.random() * 100000);
    const orderNumber = `UP80-${currentDate.getFullYear()}${
      currentDate.getMonth() + 1
    }${currentDate.getDate()}-${randomNumber}`;
    return orderNumber;
  };

  const calculateTotalPrice = (item) => {
    const additionalCharges = item * 0.1;
    const totalPrice = parseFloat(parseFloat(item) + additionalCharges);
    return totalPrice;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <div className="order-list-container">
      <h1 className="h2-order">Order List Page</h1>
      {/* ...existing code... */}

      <div className="create-order-section">
        <h2 className="h3-order">Create Order</h2>
        <div className="search-container">
          <div className="search-item">
            <label className="form-label">Vehicle Selection by City:</label>
            <CitySearch fun={set_Vehicle} />
          </div>
          <div className="search-item">
            <label className="form-label">Item Selection:</label>
            <IteamSearch fun={SETITEM} fun2={setToalPrice} />
          </div>
          <div className="search-item">
            <label className="form-label">Customer Selection:</label>
            <CustomerSearch fun={SETCUSTOMER} fun2={setDeliveryLocation} />
          </div>
          <button onClick={handleCreateOrder} className="btn-primary-order">
            Create Order
          </button>
        </div>
        <OrderSearch fun={setOrder}/>
        {order._id && (
          <div style={{ margin:"auto",marginTop: "20px", border: "1px solid #ccc", padding: "10px", width:"50%" }}>
            <h3>Searched Order</h3>
            <p><strong>Order ID:</strong> {order?._id}</p>
            <p><strong>Order Number:</strong> {order?.orderNumber}</p>
            <p><strong>Delivered:</strong> {order?.isDelivered ? "Yes" : "No"}</p>
            <p><strong>Price:</strong> ${order.price}</p>
            <p><strong>Created At:</strong> {formatDate(order?.createdAt)}</p>
            <p><strong>Updated At:</strong> {formatDate(order?.updatedAt)}</p>
            <p><strong>Customer ID:</strong> {order?.customerId}</p>
            <p><strong>Delivery Vehicle ID:</strong> {order?.deliveryVehicleId}</p>
            <p><strong>Item ID:</strong> {order?.itemId}</p>
            <button 
              style={{backgroundColor:"lightblue",borderRadius:"10px",padding:"10px"}}
              onClick={() => setOrder({})}
            >close</button>
          </div>
        )}
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Number</th>
            <th>Delivered</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Customer ID</th>
            <th>Delivery Vehicle ID</th>
            <th>Item ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.orderNumber}</td>
              <td>{order.isDelivered ? "Yes" : "No"}</td>
              <td>Rs.{order.price}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatDate(order.updatedAt)}</td>
              <td>{order.customerId}</td>
              <td>{order.deliveryVehicleId}</td>
              <td>{order.itemId}</td>
              <td>
                {!order.isDelivered && (
                  <button
                    onClick={() => handleMarkDelivered(order._id)}
                    className="btn btn-primary"
                  >
                    Mark Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListPage;
