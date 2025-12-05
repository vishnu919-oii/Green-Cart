import Address from "../models/address.js";

// Add Address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const address = req.body;

    await Address.create({ ...address, userId });

    res.json({ success: true, message: "Address Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Address
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
