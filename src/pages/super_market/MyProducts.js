import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";

import Navbar from "./Navbar";

function MyProducts() {
  const navigate = useNavigate();
  const [products, setproducts] = useState([]);

  const getMyProducts = async () => {
    console.log("Inside fun");
    const q = query(
      collection(
        db,
        localStorage.getItem("who") +
          "/" +
          getAuth().currentUser.email +
          "/products/"
      )
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setproducts((products) => [...products, doc.data()]);
    });
  };

  const addProducts = () => {
    navigate("/addproduct");
  };

  const deleteProduct = async (product) => {
    await deleteDoc(
      doc(
        db,
        "supermarket/" + getAuth().currentUser.email + "/products",
        product
      )
    );
    setproducts((products) => []);
    getMyProducts();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>Your Products</h2>
          </div>
        </div>
        <div className="row">
          <div
            onClick={getMyProducts}
            className={`col ${
              products.length === 0 ? "btn btn-secondary" : "d-none"
            }`}
          >
            Show Products
          </div>
        </div>
        <div className="row">
          {products.map((element, index) => {
            return (
              <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
                <div
                  className="card border-secondary mb-3 m-auto"
                  style={{ maxWidth: "18rem" }}
                >
                  <div className="card-header bg-transparent border-success fw-bold">
                    {element.name}
                    <i
                      onClick={() => {
                        deleteProduct(element.name);
                      }}
                      class="bi bi-trash3 float-end  "
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                  <div className="card-body text-secondary">
                    <div className="card-text">Price : ₹{element.price}</div>
                    <div className="card-text">
                      Discounted : ₹{element.discounted_price}
                    </div>
                    <div className="card-text">
                      Quantity : {element.quantity}
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-success text-danger">
                    {element.exp_date}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="col-lg-3 col-md-4 col-sm-6">
            <button
              onClick={addProducts}
              className={`${
                products.length === 0
                  ? "d-none"
                  : "btn btn-outline-success w-100"
              }`}
            >
              Add product
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProducts;
