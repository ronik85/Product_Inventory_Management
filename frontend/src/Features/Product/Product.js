import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Container,
  Typography,
  Box,
} from "@mui/material";
import axios from "../../Utils/api.js";
import { useNavigate, useParams } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "",
    price: "",
    description: "",
    status: 0,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!id && !formData.image) errors.image = "Image is required";
    if (!id && !formData.category) errors.category = "Category is required";
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (formData.price <= 0) {
      errors.price = "Must be a positive number";
    }
    if (!formData.description) errors.description = "Description is required";
    return errors;
  };

  useEffect(() => {
    fetchCategory();
    id && fetchProductById();
  }, []);

  const fetchProductById = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(`/products/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const product = response.data.data;
      setFormData({
        name: product.name,
        image: null, // Assuming you might want to upload a new image
        category: product.category.name,
        price: product.price,
        description: product.description,
        status: product.status,
      });
    } catch (error) {
      console.error("Error fetching product details by ID:", error);
    }
  };

  const fetchCategory = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
      },
    });
    const categories = response?.data?.data.map((items) => items.name);
    setCategories(categories);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("image", formData.image);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("status", formData.status);

      const token = localStorage.getItem("accessToken");

      try {
        await axios.post("/products/createProduct", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
    setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("status", formData.status);

      const token = localStorage.getItem("accessToken");

      try {
        await axios.patch(`/products/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" textAlign={"center"}>
        {!id ? "Add Product" : "Update product"}
      </Typography>
      <form onSubmit={id ? handleUpdate : handleSubmit} noValidate>
        <Box mb={2}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Box>
        {!id && (
          <Box mb={2}>
            <TextField
              label="Image"
              type="file"
              onChange={handleFileChange}
              error={!!errors.image}
              helperText={errors.image}
            />
          </Box>
        )}
        {!id && (
          <Box mb={2}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Box>
        )}
        <Box mb={2}>
          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
          />
        </Box>

        <Box mb={2}>
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Box>

        <Box mb={2}>
          <TextField
            name="status"
            label="Status"
            type="number"
            fullWidth
            value={formData.status}
            onChange={handleChange}
            error={!!errors.status}
            helperText={errors.status}
          />
        </Box>

        {id ? (
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update
          </Button>
        ) : (
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        )}
      </form>
    </Container>
  );
};

export default Product;
