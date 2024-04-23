import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../store/actions/itemActions";
import CreateItemModal from "../components/CreateItemModal ";

const ItemListPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((store) => store.itemReducer);

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const { token } = useSelector((store) => store.authReducer);
  useEffect(() => {
    dispatch(fetchItems(token));
  }, []);

  return (
    <div style={{ marginTop: "120px" }}>
      <h1 className="h2">Item List Page</h1>
      <button className="item-card-button" onClick={toggleModal}>
        Create Item
      </button>
      <ul className="flex flex-row ">
        {items &&
          items.map((item) => (
            <div className="item-card" key={item._id} style={{width:"50%", margin:"auto", marginBottom:"10px"}}>
              <div className="item-card-header">{item.name}</div>
              <div className="item-card-price">${item.price}</div>
            </div>
          ))}
      </ul>
      <CreateItemModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default ItemListPage;
