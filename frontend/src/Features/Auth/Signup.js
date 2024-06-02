import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "../../Utils/api.js";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validate = (data) => {
    let errors = {};
    if (!data.fullname) errors.fullname = "Full Name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!validateEmail(data.email)) errors.email = "Invalid email format";
    if (!data.phoneNumber) errors.phoneNumber = "Phone Number is required";
    if (!data.password) errors.password = "Password is required";
    return errors;
  };

  const validateEmail = (email) => {
    const re = /^[^@]+@[^@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataToSend = {
      email: data.get("email"),
      password: data.get("password"),
      fullname: data.get("fullname"),
      phoneNumber: data.get("phoneNumber"),
    };
    const errors = validate(dataToSend);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const response = await axios.post("/users/register", dataToSend);

      if (response.status >= 200 && response.status < 220) {
        navigate("/");
      } else {
        setError("Invalid registration");
      }
    } catch (error) {
      if (error.response.status === 400) {
        setError("User with email or phonenumber already exists");
      } else {
        setError("An error occurred during registration");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          method="POST"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="fullname"
            label="Full Name"
            type="fullname"
            id="fullname"
            autoComplete="fullname"
            error={Boolean(formErrors.fullname)}
            helperText={formErrors.fullname}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            type="number"
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="phoneNumber"
            autoFocus
            error={Boolean(formErrors.phoneNumber)}
            helperText={formErrors.phoneNumber}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
          />
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <RouterLink to={"/"}>
                <Link href="#" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
