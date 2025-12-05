import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000" || "https://green-cart-backend-azure.vercel.app";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);

      if (data.success) setProducts(data.products);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch Seller Status safely
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/is-auth`);
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // ✅ Fetch User safely
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/is-auth`);
      if (data.success) {
        setUser(data.user);
        setCartItems(
          typeof data.user.cartItems === "object" &&
            !Array.isArray(data.user.cartItems)
            ? data.user.cartItems
            : {}
        );
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
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
    toast.success("Cart Updated");
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
    Object.values(cartItems).reduce((total, val) => {
      if (typeof val === "object") return total + (Number(val.qty) || 0);
      return total + (Number(val) || 0);
    }, 0);

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
  useEffect(() => {
    if (!user) return; // wait until user exists

    const updateCart = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems }, { withCredentials: true });
      } catch (error) {
        if (error.response?.status !== 401) {
          toast.error(error.message);
        }
      }
    };

    updateCart();
  }, [cartItems,user]); // REMOVE user from dependency

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
