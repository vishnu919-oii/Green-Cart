import User from "../models/user.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems: cartItems || {} },
      { new: true }
    );

    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findById(userId).select("cartItems");

    res.json({ success: true, cartItems: user.cartItems || {} });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
