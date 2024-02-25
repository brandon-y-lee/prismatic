import React from "react";
import { Spin } from "antd";
import { Box } from "@mui/material";

const PageLoader = () => {
  return (
    <Box display='flex' justifyContent='center'>
      <Spin size="large" />
    </Box>
  );
};
export default PageLoader;
