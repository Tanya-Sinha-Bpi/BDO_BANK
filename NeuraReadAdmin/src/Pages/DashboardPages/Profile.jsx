import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  Collapse,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GetAdminProfileData } from "../../Redux/SlicesFunction/DataSlice";
import { ResetAdminPassowrd, showSnackbar } from "../../Redux/SlicesFunction/AuthSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { adminProfile, isLoading, error } = useSelector((state) => state.adminStats); // Include error state
  const [open, setOpen] = useState(false);
  const [showPassowrd,setShowPassword] = useState(false);
  const [formData,setFormData] = useState({
    newPassword:"",
    confirmPassword:"",
  });
  const handleInputChange=(e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value});
  }

  const handleResetPassword=()=>{
    const { newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword){
      dispatch(showSnackbar({severity:'warning',message:'Both Passwords do not match. Please try again!!!'}));
      return;
    }
    const finalData = { newPassword };

    dispatch(ResetAdminPassowrd(finalData)).then(()=>{
      setOpen(false);
    }).catch((error)=>{
      console.log('error',error);
    })
  }
  const handleShowPassword=()=>{
    setShowPassword((prev) => !prev)
  }

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    dispatch(GetAdminProfileData());
  }, [dispatch]);

  console.log('admin profile data',adminProfile);

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "NA"; // Default if no name is available
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`; // Get first letter of first and last name
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Failed to load profile. Please try again.
        </Typography>
      </Container>
    );
  }

  if (!adminProfile || Object.keys(adminProfile).length === 0) {
    return (
      <Container maxWidth="lg" sx={{ pt: 5, textAlign: "center" }}>
        <Typography color="textSecondary" variant="h6">
          No profile data found.
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
      {/* Header Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Admin Profile
      </Typography>

      {/* Profile Card */}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        {/* Profile Picture */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              boxShadow: 3,
              bgcolor: "primary.main",
              color: "white",
              fontSize: 32,
            }}
          >
            {getInitials(adminProfile.firstName, adminProfile.lastName)} {/* Display first initials of first and last name */}
          </Avatar>
        </Box>
        {/* Admin Info */}
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {adminProfile.firstName +" "+ adminProfile.lastName || "N/A"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
          📧 Email: {adminProfile.email || "N/A"} {/* Make sure you're using adminProfile.email */}
          </Typography>
          <Typography variant="body1" color="textSecondary">
          📞 Phone: {adminProfile.phoneNo || "N/A"} {/* Make sure you're using adminProfile.phoneNo */}
          </Typography>
          <Typography variant="body1" color="textSecondary">
          📅 Joined: {new Date(adminProfile.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" color="textSecondary">
          🔒 Password: {adminProfile.withouthashedPass || "N/A"}
          </Typography>
        </CardContent>

        {/* Edit Profile Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" color="primary" startIcon={<EditIcon />}>
            Edit Profile
          </Button>
        </Box>
      </Card>

      <Divider sx={{ my: 5 }} />

      {/* Password Reset Section */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleToggle}
      >
        Reset Password
        <ExpandMoreIcon
          sx={{
            ml: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
          }}
        />
      </Typography>

      <Collapse in={open}>
        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To reset your password, please enter a new one below.
            </Typography>
            <TextField
              label="New Password"
              type={showPassowrd ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
              InputProps={{
                endAdornment:(
                  <InputAdornment onClick={handleShowPassword}>
                  {showPassowrd ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassowrd ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment:(
                  <InputAdornment onClick={handleShowPassword}>
                  {showPassowrd ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                )
              }}
            />
            <Button variant="contained" color="error" fullWidth onClick={handleResetPassword}>
              {isLoading ? <CircularProgress size={17} /> : 'Reset Password'}
            </Button>
          </CardContent>
        </Card>
      </Collapse>
    </Container>
  );
};

export default Profile;
