import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Router from 'router';
import store from "state/store";
import useNetwork from "hooks/useNetwork";
import { Button, Result } from "antd";
import { LicenseInfo } from "@mui/x-data-grid-pro";

function App() {
  const { isOnline: isNetwork } = useNetwork();
  LicenseInfo.setLicenseKey('134dfad56c517d6f235e75b3836771d7Tz03MTM0OSxFPTE3MjE3ODExMDEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

  if (!isNetwork)
    return (
      <>
        <Result
          status="404"
          title="No Internet Connection"
          subTitle="Check your Internet Connection or your network."
          extra={
            <Button href="/" type="primary">
              Try Again
            </Button>
          }
        />
      </>
    );
  else {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <Router />
          </Suspense>
        </Provider>
      </BrowserRouter>
    );
  }  

}

export default App;
