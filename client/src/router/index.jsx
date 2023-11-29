import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "theme";
import AuthRouter from "./AuthRouter";
import AppRouter from "./AppRouter";
import { useSelector } from "react-redux";
import { getToken } from "utils/token";

function Router() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const token = getToken();
  console.log('token: ', token);

  return token ? (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthRouter />
    </ThemeProvider>
  );
};

export default Router;
