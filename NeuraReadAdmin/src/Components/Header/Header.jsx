import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "../../LibraryUi/UIComponent/ColorModeIconDropDown";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/ic_launcher.png";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { logout, LogoutUser } from "../../Redux/SlicesFunction/AuthSlice";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

const Header = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { isLoading, isLoggedIn } = useSelector((state) => state.auth);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleLogout = async() => {
    try{
     const response = await dispatch(LogoutUser());
     console.log('response',response)
    }catch(err){
      console.log('Error in logging out',err)
      if(err.message=== 'No active session found'){
        dispatch(logout());
      }
    }
    
  };
  return (
    <>
      <AppBar
        // position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: "calc(var(--template-frame-height, 0px) + 28px)",
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
            >
              {/* <Sitemark /> */}
              <Box
                sx={{
                  height: 50,
                  width: 100,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <img
                  src={logo}
                  alt="App Logo"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "#2196f3", fontWeight: "bold", pt: 0.2 }}
                >
                  BDO BANK
                </Typography>
              </Box>
              <Box
                sx={{ display: { xs: "none", md: "flex", paddingLeft: 10 } }}
              >
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/dashboard")}
                >
                  DashBoard
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/user")}
                >
                  User
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/dublicate-finder")}
                >
                  Duplicate DB
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/add-biller")}
                >
                  Add Billers
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/add-telecom")}
                >
                  Add Telecom Providers
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/send-bulk-email")}
                >
                  Send Bulk Email
                </Button>
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  onClick={() => navigate("/bank-data")}
                >
                  Bank Data
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {!isLoggedIn && (
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={() => navigate("auth/login")}
                >
                  Sign in
                </Button>
              )}

              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
              <ColorModeIconDropdown />
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
              <ColorModeIconDropdown size="medium" />
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    top: "var(--template-frame-height, 0px)",
                  },
                }}
              >
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <MenuItem>Features</MenuItem>
                  <MenuItem>Testimonials</MenuItem>
                  <MenuItem>Highlights</MenuItem>
                  <MenuItem>Pricing</MenuItem>
                  <MenuItem>FAQ</MenuItem>
                  <MenuItem>Blog</MenuItem>
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <Button color="primary" variant="contained" fullWidth>
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth>
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

    </>
  );
};

export default Header;
