import { Box, useTheme, Grid } from "@mui/material";
import Form from "./form";
import login from "assets/login.png";


const Login = () => {
  const theme = useTheme();

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor={theme.palette.background.alt}
        >
          <img src={login} alt="Aleth Logo" height="130px" />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="white"
        >
          <Box width="50%" borderRadius="1.5rem">
            <Form />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;