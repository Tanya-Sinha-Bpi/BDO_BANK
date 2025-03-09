import { Box, Container, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAndLogoutIfTokenExpired } from "../Redux/SlicesFunction/AuthSlice";
import SessionTimer from "../Components/SessionTimes";

const DashboardLayout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const isDarkMode = theme.palette.mode === "dark";
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login"); // Navigate to dashboard if user is logged in
    }
  }, [isLoggedIn]);
  // useEffect(() => {
  //   checkAndLogoutIfTokenExpired();
  // }, [dispatch]);
  return (
    <Container maxWidth="lg">
      <Header />
      <Box
        sx={{
          width: "100%",
          pt: "calc(var(--template-frame-height, 0px) + 8rem)",
          height: "100%",
        }}
      >
        <Outlet />

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            paddingRight: 3,
          }}
        >
          <SessionTimer />
        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default DashboardLayout;
