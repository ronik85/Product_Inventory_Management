import React, { useEffect, useState } from "react";
import "./dashboard.css";
import DashboardHeader from "./DashboardHeader.js";
import axios from "../../Utils/api.js";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const Dashboard = () => {
  const columns = [
    {
      field: "image",
      headerName: "IMG",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <img
          src={params.value}
          height="40"
          width="40"
          style={{ marginLeft: "10px", marginTop: "5px" }}
          alt="product"
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "category",
      headerName: "Category",
      sortable: false,
      flex: 1,
      minWidth: 100,
    },
    { field: "price", headerName: "Price", flex: 1, minWidth: 100 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 100 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      minWidth: 300,
      renderCell: ({ row }) => (
        <>
          <Button variant="outlined">
            <Link
              to={`/product/${row._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              update
            </Link>
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDelete(row._id)}
            sx={{ margin: 1 }}
            color="error"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryValue, setCategoryValue] = useState("all");

  const fetchData = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProductData(response.data.data);
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

  const fetchDataByCategory = async (e) => {
    setCategoryValue(e.target.value);
    const token = localStorage.getItem("accessToken");
    if (e.target.value === "all") {
      fetchData();
      return;
    }
    try {
      const response = await axios.get(`/products/${e.target.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductData(response.data.data);
    } catch (error) {
      setProductData([]);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setCategoryValue("all");
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);

  const transformedProducts = productData.map((item) => ({
    ...item,
    category: item.category?.name,
  }));
  return (
    <>
      <DashboardHeader />
      <main className="main_section">
        <div className="container">
          <div className="search_section">
            <i className={`fas fa-search search_icon`}></i>
            <select
              className="search_input"
              onChange={(e, data) => fetchDataByCategory(e)}
              value={categoryValue}
            >
              <option value="all">Category</option>
              {categories.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={transformedProducts}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableColumnMenu
              disableSelectionOnClick
              getRowId={(products) => products._id}
            />
          </div>

          <div className="btnContainer">
            <Button variant="outlined" className="addBtn">
              <Link to={"/product"}>Add Product</Link>
            </Button>
            <Button variant="outlined" className="addBtn">
              <Link to={"/category"}>Add Category</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
