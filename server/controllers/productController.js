import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

// Cloudinary Safe Config (for Vercel)
const ensureCloudinaryConfigured = () => {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
};

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    ensureCloudinaryConfigured();

    // Parse productData safely
    let productData = {};
    try {
      productData = JSON.parse(req.body.productData || "{}");
    } catch (err) {
      return res.json({ success: false, message: "Invalid product data" });
    }

    // Multer Files Fix (supports images[] or single image)
    const files =
      req.files?.images || req.files || [];

    if (!files || files.length === 0) {
      return res.json({ success: false, message: "No images uploaded" });
    }

    // Upload Promise Function
    const uploadImage = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(fileBuffer);
      });
    };

    // Upload All Images
    const imageUrls = await Promise.all(
      files.map((file) => uploadImage(file.buffer))
    );

    // Create product
    await Product.create({ ...productData, image: imageUrls });

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List Products
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Product by ID
export const productById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    await Product.findByIdAndUpdate(id, { inStock });

    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
