import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Menu,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBankAccountByAdmin,
  deleteUserByIdForAdmin,
  fetchTotalUsersList,
  updateTotalUsersWithDetailsList,
} from "../../Redux/SlicesFunction/DataSlice";
import {
  BlockUserByAdmin,
  CreateUserByAdmin,
  UNBlockUserByAdmin,
} from "../../Redux/SlicesFunction/AuthSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { totalUserswithDetails, isLoading, error } = useSelector(
    (state) => state.adminStats
  );
  const handleTogglePasswordModal = () => {
    setShowPasswordModal((prev) => !prev);
  };
  const [load, setLoad] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    dateOfBirth: "",
  });
  const [formData1, setFormData1] = useState({
    accountType: "Savings",
    branchName: "",
  });

  const users = totalUserswithDetails || [];
  // Filter & Sort Users
  const filteredUsers = users
    .filter(
      (user) =>
        // Concatenate firstName and lastName for search functionality
        (
          user.firstName?.toLowerCase() +
          " " +
          user.lastName?.toLowerCase()
        ).includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNo?.includes(searchQuery)
    )
    .sort((a, b) =>
      sortBy === "name"
        ? (a.firstName + " " + a.lastName).localeCompare(
            b.firstName + " " + b.lastName
          )
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
    setSelectedUserId(user._id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  useEffect(() => {
    dispatch(fetchTotalUsersList());
  }, [dispatch]);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen1 = () => {
    setOpenModal1(true);
  };

  const handleModalClose1 = () => {
    setOpenModal1(false);
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      dispatch(CreateUserByAdmin(formData));
      setOpenModal(false);
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.log("error", error);
    } // Close modal after submitting
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    try {
      // console.log('formdata and id',formData1,selectedUserId);
      dispatch(createBankAccountByAdmin(formData1, selectedUserId));
      setOpenModal1(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDeleteUser = (userId) => {
    console.log("selected user for delete", userId);
    dispatch(deleteUserByIdForAdmin(userId));
  };

  const handleBlockUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, isBlocked: true } : user
    );

    dispatch(
      updateTotalUsersWithDetailsList({
        totalUserswithDetails: updatedUsers,
      })
    );
    dispatch(BlockUserByAdmin(userId))
      .then(() => {
        // After the block operation succeeds, fetch the latest user data
        dispatch(fetchTotalUsersList());
      })
      .catch((error) => {
        // Revert optimistic update if the operation fails
        const revertedUsers = users.map((user) =>
          user._id === userId ? { ...user, isBlocked: false } : user
        );
        dispatch(
          updateTotalUsersWithDetailsList({
            totalUserswithDetails: revertedUsers,
          })
        );
      });
  };

  const handleUnBlockUser = (userId) => {
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, isBlocked: true } : user
    );

    dispatch(
      updateTotalUsersWithDetailsList({
        totalUserswithDetails: updatedUsers,
      })
    );

    dispatch(UNBlockUserByAdmin(userId))
      .then(() => {
        // After the block operation succeeds, fetch the latest user data
        dispatch(fetchTotalUsersList());
      })
      .catch((error) => {
        // Revert optimistic update if the operation fails
        const revertedUsers = users.map((user) =>
          user._id === userId ? { ...user, isBlocked: false } : user
        );
        dispatch(
          updateTotalUsersWithDetailsList({
            totalUserswithDetails: revertedUsers,
          })
        );
      });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">
          Failed to load users. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4facfe, #00f2fe)",
          color: "white",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        <Typography variant="body1">
          View and manage all registered users.
        </Typography>
      </Box>

      {/* Search & Sorting */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search users..."
          size="small"
          sx={{ width: "70%" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/* Sort Dropdown */}
        <FormControl size="small" sx={{ width: "25%" }}>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="name">Sort by Name</MenuItem>
            <MenuItem value="joined">Sort by Date Joined</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* User Cards */}
      {/* <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        gap={2}
      >
        {filteredUsers.map((user) => (
          <Card
            key={user._id}
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon fontSize="large" />
                    <Typography variant="h6" fontWeight="bold" ml={1}>
                      {user.firstName + " " + user.lastName}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2">📧 {user.email}</Typography>
                  <Typography variant="body2">📞 {user.phoneNo}</Typography>
                  <Typography variant="body2">
                    📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    {user?.balance === "No account created" ? (
                      <>🏦 No account created</> // If no bank account exists
                    ) : (
                      <>💰 Balance: {user.balance}</> // If the user has a bank account, show the balance
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: user?.isBlocked ? "red" : "#ffeb3b",
                      fontWeight: user?.isBlocked ? "bold" : "normal",
                    }}
                  >
                    {user?.isBlocked ? (
                      <>🔒 Account Blocked: Yes</>
                    ) : (
                      <>✅ Account Blocked: No</>
                    )}
                  </Typography>
                </Box>

                <Box sx={{ position: "relative", top: -10 }}>
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVertIcon sx={{ color: "#fff" }} />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 0.2,
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ color: showPassword ? "#b71c1c" : "#ffd600" }}
                >
                  🔒 Password:{" "}
                  {showPassword ? user.withouthashedPass || "N/A" : "********"}
                </Typography>

                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? (
                    <VisibilityOff color="#fff" />
                  ) : (
                    <Visibility color="#fff" />
                  )}
                </IconButton>
              </Box>

              {user.createdByAdmin && (
                <Box
                  sx={{
                    width: "100%",
                    height: "40px", // Approximate height of the box
                    backgroundColor: "#f5c300", // Background color
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <StarIcon sx={{ color: "#00c853", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Created by Admin
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box> */}

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {filteredUsers.map((user, index) => (
          <React.Fragment key={user._id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                p: 2,
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                borderRadius: 2,
              }}
            >
              {/* Top Row: Name and Menu */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box display="flex" alignItems="center">
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>

                <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Detail List */}
              <Box mt={1}>
                <Typography variant="body2">📧 {user.email}</Typography>
                <Typography variant="body2">📞 {user.phoneNo}</Typography>
                <Typography variant="body2">
                  📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {user?.balance === "No account created" ? (
                    <>🏦 No account created</>
                  ) : (
                    <>💰 Balance: {user.balance}</>
                  )}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: user?.isBlocked ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {user?.isBlocked
                    ? "🔒 Account Blocked: Yes"
                    : "✅ Account Blocked: No"}
                </Typography>
              </Box>

              {/* Password Row */}
              <Box
                mt={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="body2"
                  sx={{ color: showPassword ? "#d32f2f" : "#fbc02d" }}
                >
                  🔒 Password:{" "}
                  {showPassword ? user.withouthashedPass || "N/A" : "********"}
                </Typography>

                <IconButton onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>

              {/* Admin Tag */}
              {user.createdByAdmin && (
                <Box
                  sx={{
                    backgroundColor: "#fff8e1",
                    mt: 1.5,
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  <StarIcon sx={{ color: "#00c853", mr: 1 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Created by Admin
                  </Typography>
                </Box>
              )}
            </ListItem>

            {/* Divider Between Users */}
            {index !== filteredUsers.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedUser?.isBankAccountCreated && (
          <MenuItem
            onClick={() => {
              navigate(`/contacts/${selectedUser._id}`);
              handleMenuClose();
            }}
          >
            Create Transactions
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleDeleteUser(selectedUser._id);
            handleMenuClose();
          }}
        >
          Delete User
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleModalOpen1();
            handleMenuClose();
          }}
          disabled={selectedUser?.isBankAccountCreated}
        >
          Create Bank Account of this User
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/gallery/${selectedUser._id}`);
            handleMenuClose();
          }}
        >
          Show All Transactions
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleBlockUser(selectedUser._id);
            handleMenuClose();
          }}
        >
          Block User
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleUnBlockUser(selectedUser._id);
            handleMenuClose();
          }}
        >
          UnBlock User
        </MenuItem>
      </Menu>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          paddingY: 10,
        }}
      >
        <Button variant="contained" onClick={handleModalOpen}>
          Create New User
        </Button>
      </Box>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            fullWidth
            margin="normal"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="normal"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {/* <DatePicker
            selected={formData.dateOfBirth}
            onChange={(date) => handleInputChange(date)}
            dateFormat="dd/MM/yyyy"
          /> */}
          {/* <DatePicker selected={formData.dateOfBirth} onChange={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))} dateFormat="dd/MM/yyyy" /> */}
          {/* <TextField
            label="DOB(YYYY-MM-DD)"
            fullWidth
            margin="normal"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          /> */}
          <TextField
            fullWidth
            type="date"
            label="DOB"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true, // Ensures the label doesn’t overlap with the selected date
            }}
          />
          <TextField
            label="Phone No"
            fullWidth
            margin="normal"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
          />
          <TextField
            label="Password"
            type={showPasswordModal ? "text" : "password"}
            fullWidth
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordModal} edge="end">
                    {showPasswordModal ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="outline" color="primary">
            {load ? <CircularProgress size={15} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModal1} onClose={handleModalClose1}>
        <DialogTitle>Create New Bank Account of This User</DialogTitle>
        <DialogContent>
          <TextField
            label="Account Type"
            fullWidth
            margin="normal"
            name="accountType"
            value={formData1.accountType}
            onChange={handleInputChange1}
          />
          <TextField
            label="Branch Name"
            fullWidth
            margin="normal"
            name="branchName"
            value={formData1.branchName}
            onChange={handleInputChange1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose1} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateAccount}
            variant="outline"
            color="primary"
          >
            {load ? <CircularProgress size={15} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default User;
