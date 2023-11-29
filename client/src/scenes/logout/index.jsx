
import React, { useEffect } from "react";
import { useLogoutMutation } from "state/api";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    async function asyncLogout() {
      await logout().unwrap();
      navigate("/login");
    }
    asyncLogout();
  }, [logout, navigate]);

  return <></>; // Optionally, render some logout UI
};

export default Logout;
