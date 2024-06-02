import React, { useEffect, useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../Utils/api.js";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Category = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [category, setCategory] = useState("");
  const [isUpdateBtnClicked, setIsUpdateBtnClicked] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRows(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCategory = async () => {
    if (!category.trim()) {
      setError("Name is required");
      return;
    }
    const dataToSend = {
      name: category,
    };
    const existingCategory = rows.find(
      (row) => row.name.toLowerCase() === category.toLowerCase()
    );
    if (existingCategory) {
      setError("Category already exists");
      return;
    }
    const token = localStorage.getItem("accessToken");
    await axios.post("/categories/createCategory", dataToSend, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCategories().then(setCategory(""));
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`/categories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCategories().then(setCategory(""));
  };
  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `/categories/${categoryId}`,
        { name: category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      setCategory("");
      setIsUpdateBtnClicked(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const columns = [
    { field: "name", headerName: "Name", sortable: false, flex: 1 },
    {
      field: "actionBtn",
      headerName: "Action",
      width: 80,
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <>
          <Button
            variant="outlined"
            onClick={() => {
              setIsUpdateBtnClicked(true);
              setCategory(row.name);
              setCategoryId(row._id);
            }}
          >
            update
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDelete(row._id)}
            sx={{ margin: 1 }}
            color="error"
          >
            Remove
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" textAlign={"center"}>
        Categories
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableColumnMenu
          disableSelectionOnClick
          getRowId={(products) => products._id}
        />
      </div>
      <Typography
        variant="h4"
        component="h1"
        textAlign={"center"}
        sx={{ marginTop: 2 }}
      >
        Add category
      </Typography>
      <TextField
        label="Category Name"
        variant="outlined"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setError("");
        }}
        error={Boolean(error)}
        helperText={error}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      {isUpdateBtnClicked ? (
        <Button variant="contained" onClick={() => handleUpdate()}>
          Update Category
        </Button>
      ) : (
        <Button variant="contained" onClick={handleAddCategory}>
          Add Category
        </Button>
      )}
    </Container>
  );
};

export default Category;
