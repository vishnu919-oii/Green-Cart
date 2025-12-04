import User from "../models/user.js";

// Update or overwrite cart
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // from authUser middleware
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems: cartItems || {} },
      { new: true }
    );

    res.json({ success: true, message: "Cart Updated", cartItems: user.cartItems });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get current cart items (for popup)
export const getCart = async (req, res) => {
  try {
    const userId = req.userId; // from authUser middleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("cartItems");
    res.json({ success: true, cartItems: user.cartItems || {} });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
