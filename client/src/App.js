import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Router from 'router';
import store from "state/store";
import useNetwork from "hooks/useNetwork";
import { Button, Result } from "antd";

function App() {
  const { isOnline: isNetwork } = useNetwork();

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
