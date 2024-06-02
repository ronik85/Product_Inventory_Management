import { AsyncHandler } from "./../utils/AsyncHandler.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = AsyncHandler(async (req, res) => {
  const { name, price, description, category, status } = req.body;
  if (!name) throw new ApiError(400, "Name is required");
  if (!description) throw new ApiError(400, "Description is required");
  if (!price) throw new ApiError(400, "Price is required");
  if (!category) throw new ApiError(400, "Category is required");

  let categoryDoc = await Category.findOne({
    name: category,
  });
  if (!categoryDoc) {
    throw new ApiError(400, "category doesnot exist");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image field is missing");
  }
  const uploadedImage = await uploadOnCloudinary(imageLocalPath);

  if (!uploadedImage.secure_url) {
    throw new ApiError(400, "Error while uploading the avatar");
  }

  const product = await Product.create({
    name,
    image: uploadedImage.secure_url,
    description,
    price,
    category: categoryDoc?._id || "",
    status: status || 0,
  });

  const createdProduct = await Product.findById(product._id);
  if (!createdProduct)
    throw new ApiError(500, "Error while publishing the product");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product registered successfully"));
});

const getProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});
const getProductById = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).populate("category");
  if (!product) throw new ApiError(404, "Product not found");
  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

const updateProduct = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, description, category, status } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.category = category || product.category;
  product.status = status || product.status;

  await product.save();

  const updatedProduct = await Product.findById(productId).populate("category");
  res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = AsyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const deletedProduct = await Product.findByIdAndDelete(productId);
  res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});
const getProductsByCategory = AsyncHandler(async (req, res) => {
  const { categoryName } = req.params;

  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const products = await Product.find({ category: category._id }).populate(
    "category"
  );

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found for the specified category");
  }
  res
    .status(200)
    .json(new ApiResponse(200, products, "Product fetched successfully"));
});

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
