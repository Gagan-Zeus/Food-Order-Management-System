/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import { useState, useEffect } from "react";
import { fetchFoodList } from "../service/FoodService";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  deleteFromCart,
} from "../service/cartService";
import { fallbackFoods } from "../assets/assets";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [foodList, setFoodList] = useState(fallbackFoods);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId, amount = 1) => {
    const qty = Number(amount) || 1;
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + qty }));
    if (token) {
      await addToCart(foodId, qty);
    }
  };

  const addItemsToCart = async (items) => {
    if (!items || items.length === 0) return;
    setQuantities((prev) => {
      const next = { ...prev };
      items.forEach(({ foodId, quantity }) => {
        next[foodId] = (next[foodId] || 0) + (Number(quantity) || 1);
      });
      return next;
    });

    if (token) {
      for (const item of items) {
        await addToCart(item.foodId, Number(item.quantity) || 1);
      }
    }
  };

  const decreaseQty = async (foodId) => {
    if (quantities[foodId] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [foodId]: prev[foodId] - 1,
      }));
      if (token) {
        await removeQtyFromCart(foodId);
      }
    }
  };

  const removeFromCart = async (foodId) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[foodId];
      return updatedQuantities;
    });

    if (token) {
      await deleteFromCart(foodId);
    }
  };

  const loadCartData = async () => {
    try {
      const items = await getCartData();
      setQuantities(items || {});
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const clearCart = () => {
    setQuantities({});
  };

  const contextValue = {
    foodList,
    increaseQty,
    addItemsToCart,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    clearCart,
    user,
    setUser,
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchFoodList();
        setFoodList(data?.length ? data : fallbackFoods);
      } catch {
        // Keep the storefront browsable if the API is temporarily offline.
        setFoodList(fallbackFoods);
      }

      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        setToken(savedToken);

        try {
          const items = await getCartData();
          setQuantities(items || {});
        } catch (err) {
          console.error("Initial cart load failed", err);
          if (err.response?.status === 401 || err.response?.status === 403) {
            setToken("");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing saved user", e);
        }
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
