import React from "react";
import Menubar from "./components/Menubar/Menubar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import ExploreFood from "./pages/ExploreFood/ExploreFood";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { ToastContainer } from "react-toastify";
import MyOrders from "./pages/MyOrders/MyOrders";
import { useContext } from "react";
import { StoreContext } from "./context/StoreContext";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import "./App.css";

const App = () => {
  const { token } = useContext(StoreContext);
  const location = useLocation();
  return (
    <div className="app">
      <Menubar />
      <ToastContainer position="top-right" theme="light" ariaLabel="Notifications" />
      <div className="route-transition" key={location.key}>
        <span className="route-transition-bar" aria-hidden="true" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<ExploreFood />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={token ? <PlaceOrder /> : <Login />} />
          <Route path="/login" element={token ? <Home /> : <Login />} />
          <Route path="/register" element={token ? <Home /> : <Register />} />
          <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />
          <Route
            path="/track/:orderId"
            element={token ? <TrackOrder /> : <Login />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
