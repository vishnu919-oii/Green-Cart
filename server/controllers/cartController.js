import User from "../models/user.js";

// Update User CartData: /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cartItems[productId] = (user.cartItems[productId] || 0) + 1;
    await user.save();

    res.json({ success: true, message: "Item added to cart", cartItems: user.cartItems });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
