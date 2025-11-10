/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL
  : (import.meta.env.DEV ? "http://localhost:4000" : "https://green-cart-dun-three.vercel.app");


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState(()=>{
     const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
const {data} = await axios.get('/api/product/list')     

      if (data.success) {
        setProducts(data.products);
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch Seller Status safely
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      // localStorage.getItem("seller") === "true";
      setIsSeller(!!data.success);
    } catch (error) {
      // Don't show popup for unauthorized (normal when logged out)
      if (error.response?.status !== 401) {
        toast.error("Failed to verify seller");
      }
      setIsSeller(false);
    }
  };

  // ✅ Fetch User safely
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      // localStorage.getItem("user") === "true";
      if(data.success){
        setUser(!!data.success);
        setCartItems(data.user.cartItems || JSON.parse(localStorage.getItem("cartItems")) || {});
      }
    } catch (error) {
      setUser(null);
      // Ignore 401 (not logged in), show only real errors
      if (error.response?.status !== 401) {
        toast.error("Failed to verify user");
      }
      setUser(false);
    }
  };

  // ✅ Add to Cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // ✅ Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // ✅ Remove item
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Removed from cart");
  };

  // ✅ Cart count and total
  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, val) => acc + val, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = products.find((p) => p._id === id);
      if (item) total += item.offerPrice * cartItems[id];
    }
    return Math.floor(total * 100) / 100;
  };

  // ✅ Initial data load
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  // ✅ Update cart only if user is logged in
  useEffect(()=>{
    const updateCart = async () => {
    try {
      const {data} = await axios.post('/api/cart/update', {cartItems})
      if (!data.success) {
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  if (user) {
    updateCart()
  }
  },[cartItems])


  const value = {
    navigate,
    user,
    setIsSeller,
    setUser,
    isSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    setSearchQuery,
    searchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
