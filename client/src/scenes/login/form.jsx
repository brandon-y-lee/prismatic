import { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { setToken, setLoggedInUser } from "utils/token";
import { useLoginMutation, useRegisterMutation } from "state/api";


const registerSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const theme = useTheme();
  const isLogin = pageType === "login";

  const handleFormSubmit = async (values, { resetForm }) => {
    if (isLogin) {
      try {
        const response = await login({ email: values.email, password: values.password }).unwrap();
        if (response && response.token) {
          setToken(response.token);
          setLoggedInUser(response.user);
          window.location.reload();
        } else {
          console.log("Login failed: Response doesn't include token.");
        }
      } catch (error) {
        console.error("Login error: ", error);
      }
    } else {
      try {
        await register({ name: values.name, email: values.email, password: values.password }).unwrap();
        setPageType("login");
      } catch (error) {
        console.error("Registration error: ", error);
      }
    }
    resetForm();
  };

  const initialValues = isLogin
    ? { email: '', password: '' }
    : { name: '', email: '', password: '' };
  
  const validationSchema = isLogin ? loginSchema : registerSchema;

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: "span 4" },
              backgroundColor: theme.palette.background.alt,
              p: '3rem',
              borderRadius: '12px',
            }}
          >
            {!isLogin && (
              <>
                <TextField
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={Boolean(touched.name) && Boolean(errors.name)}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            <Button 
              type="submit"
              variant="contained"
              sx={{
                gridColumn: "span 4",
                backgroundColor: 'white', 
                color: 'black', 
                '&:hover': {
                  backgroundColor: theme.palette.secondary[300],
                  color: 'white',
                },
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gridColumn: "span 4" }}>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}
                onClick={() =>
                  setPageType(isLogin ? "register" : "login")
                }
              >
                {isLogin ? "New User?" : "Already have an account?"}
              </Typography>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;