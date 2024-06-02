import { AsyncHandler } from "./../utils/AsyncHandler.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { ApiError } from "./../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { isValidObjectId } from "mongoose";

const createCategory = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new ApiError(400, "Name is required");

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }
  let tempName = name.toLowerCase().trim();
  const category = await Category.create({ name: tempName });

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created Successfully"));
});

const getCategories = AsyncHandler(async (req, res) => {
  const categories = await Category.find();
  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const updateCategory = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name) throw new ApiError(400, "name field is required");

  if (!isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid Category ID");
  }

  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  existingCategory.name = name;
  const updatedCategory = await existingCategory.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});

const deleteCategory = AsyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid Category ID");
  }
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  res
    .status(200)
    .json(
      new ApiResponse(200, deletedCategory, "Category Deleted successfully")
    );
});

export { createCategory, getCategories, updateCategory, deleteCategory };
