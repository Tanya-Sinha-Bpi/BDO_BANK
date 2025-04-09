import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Avatar,
  TextField,
  Button,
  MenuItem,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addBalance,
  createTransactionByAdminSlice,
  fetchTotalContactsByUser,
  updateUserData,
} from "../../Redux/SlicesFunction/DataSlice";

const ContactsPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { contactsByUser, isLoading, error } = useSelector(
    (state) => state.adminStats
  );
  const [open, setOpen] = useState(false);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [amount, setAmount] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenUpdateUser = () => setOpenUpdateUser(true);
  const handleCloseUpdateUser = () => setOpenUpdateUser(false);

  const [transaction, setTransaction] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    transactionType: "Deposit", // Default type
    bankType: "External", // Default type
    note: "",
    date: "",
    extBankName: "",
  });

  const [updateUser, setUpdateUser] = useState({
    userId: userId,
    firstName: contactsByUser?.firstName || "",
    lastName: contactsByUser?.lastName || "",
    email: contactsByUser?.email || "",
    phoneNo: contactsByUser?.phoneNo || "",
    dateOfBirth: contactsByUser?.dateOfBirth || "",
  });

  const handleInputChangeForUser = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitUserUpdateData = () => {
    try {
      dispatch(updateUserData(updateUser, userId));
      handleCloseUpdateUser(false);
    } catch (error) {
      console.error("error in update user", error);
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchTotalContactsByUser(userId));
    }
  }, [dispatch, userId]);

  console.log("get single user data", contactsByUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value, // This will properly update the date now
    }));
  };

  useEffect(() => {
    if (contactsByUser) {
      setTransaction((prev) => ({
        ...prev,
        fromAccount: contactsByUser.accountNumber || "", // Set accountNumber from the API response
        balance: contactsByUser.balance || "No account created", // Set balance from the API response
      }));
    }
  }, [contactsByUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(transaction.amount) || transaction.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transactionData = {
      fromAccountId: userId, // The user ID from URL params (sender's user ID)
      toAccountDetails:
        transaction.bankType === "External"
          ? {
              bankName: "External Bank", // This should be dynamic from the form
              accountName: "John Doe", // This should be dynamic from the form
              accountNumber: transaction.toAccount, // External account number
              ifscCode: "EXT1234", // External IFSC (this should be dynamic too)
            }
          : undefined,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      bankType: transaction.bankType,
      note: transaction.note,
      date: transaction.date,
      extBankName:transaction.extBankName
    };
    console.log("submitted data", transactionData);
    // Dispatch the action to create a transaction
    dispatch(createTransactionByAdminSlice(transactionData));

    dispatch(fetchTotalContactsByUser(userId));
  };

  // Helper function to get user initials
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return null;
    }
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleSubmitAmount = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      console.log("Invalid amount");
      return;
    }

    console.log("User ID:", userId, "Amount:", amount);

    dispatch(addBalance({ amount }, userId)) // ✅ Pass correctly formatted data
      .then(() => {
        window.alert("Balance added successfully");
        console.log("Balance added successfully!");
        handleClose();
      })
      .catch((err) => {
        window.alert("something error in adding balance");
        console.error("Error updating balance:", err);
      });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to fetch user details. Please try again later.
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Transaction Details
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: User Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                flexDirection={"column"}
                mb={2}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: 2,
                    width: 100,
                    height: 100,
                    fontWeight: 700,
                    fontSize: 30,
                  }}
                >
                  {contactsByUser
                    ? getInitials(
                        contactsByUser.firstName,
                        contactsByUser.lastName
                      )
                    : ""}
                </Avatar>
                <Typography variant="h6">
                  {contactsByUser
                    ? `${contactsByUser.firstName} ${contactsByUser.lastName}`
                    : "Loading..."}
                </Typography>
              </Box>

              <Typography variant="body2">
                📧 {contactsByUser?.email}
              </Typography>
              <Typography variant="body2">
                📞 {contactsByUser?.phoneNo}
              </Typography>
              <Typography variant="body2">
                📅 Joined:{" "}
                {contactsByUser
                  ? new Date(contactsByUser.createdAt).toLocaleDateString()
                  : "Loading..."}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: contactsByUser?.accountNumber ? "green" : "red",
                  fontWeight: contactsByUser?.accountNumber ? "bold" : "normal",
                }}
              >
                {contactsByUser?.accountNumber ? (
                  <>💰 Balance: {contactsByUser?.balance}</>
                ) : (
                  <>🏦 No account created</>
                )}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: contactsByUser?.isBankAccountCreated ? "green" : "red",
                  fontWeight: contactsByUser?.isBankAccountCreated
                    ? "bold"
                    : "normal",
                }}
              >
                {contactsByUser?.isBankAccountCreated ? (
                  <>💰 Account Created: Yes</>
                ) : (
                  <>🏦 Account Created: No</>
                )}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: contactsByUser?.isBlocked ? "red" : "green",
                  fontWeight: contactsByUser?.isBlocked ? "bold" : "normal",
                }}
              >
                {contactsByUser?.isBlocked ? (
                  <>🔒 Account Blocked: Yes</>
                ) : (
                  <>✅ Account Blocked: No</>
                )}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: contactsByUser?.isVerified ? "green" : "red",
                  fontWeight: contactsByUser?.isVerified ? "bold" : "normal",
                }}
              >
                {contactsByUser?.isVerified ? (
                  <>✔️ Account Verified: Yes</>
                ) : (
                  <>❌ Account Verified: No</>
                )}
              </Typography>

              <Box
                sx={{
                  paddingY: 5,
                  gap: 5,
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ fontSize: 13 }}
                  onClick={handleOpen} // Pass event
                >
                  Add Balance for this User
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ fontSize: 13 }}
                  onClick={handleOpenUpdateUser} // Pass event
                >
                  Edit User Info
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Update user mOdal */}
          <Modal
            open={openUpdateUser}
            onClose={handleCloseUpdateUser}
            aria-labelledby="add-balance-modal"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                p: 4,
                boxShadow: 24,
                borderRadius: 2,
              }}
            >
              <Typography id="add-balance-modal" variant="h6" sx={{ mb: 2 }}>
                Update User Info
              </Typography>

              <form onSubmit={handleSubmitUserUpdateData}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  <TextField
                    label="First Name"
                    type="text"
                    fullWidth
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={(e) => handleInputChangeForUser(e)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Last Name"
                    type="text"
                    fullWidth
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={(e) => handleInputChangeForUser(e)}
                    sx={{ mb: 2 }}
                  />
                </Box>
                <TextField
                  label="Email"
                  type="text"
                  fullWidth
                  name="email"
                  value={updateUser.email}
                  onChange={(e) => handleInputChangeForUser(e)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  name="phoneNo"
                  value={updateUser.phoneNo}
                  onChange={(e) => handleInputChangeForUser(e)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  name="dateOfBirth"
                  value={updateUser.dateOfBirth}
                  onChange={(e) => handleInputChangeForUser(e)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Amount Modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-balance-modal"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                p: 4,
                boxShadow: 24,
                borderRadius: 2,
              }}
            >
              <Typography id="add-balance-modal" variant="h6" sx={{ mb: 2 }}>
                Add Balance
              </Typography>

              <form onSubmit={handleSubmitAmount}>
                <TextField
                  label="Enter Amount"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Modal>

          <Card sx={{ paddingX: 2, paddingY: 5, marginTop: 3 }}>
            <Typography variant="body2" sx={{ color: "red" }}>
              Note: As an Admin, always select 'External' for the Bank Type.
            </Typography>
          </Card>
        </Grid>

        {/* Right Side: Transaction Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create Transaction
              </Typography>

              <form onSubmit={handleSubmit}>
                {/* From Account */}
                <TextField
                  fullWidth
                  label="From Account"
                  name="fromAccount"
                  value={transaction.fromAccount}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                {/* To Account */}
                <TextField
                  fullWidth
                  label="To Account"
                  name="toAccount"
                  value={transaction.toAccount}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                {/* Transaction Type */}
                <TextField
                  select
                  fullWidth
                  label="Transaction Type"
                  name="transactionType"
                  value={transaction.transactionType}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="Deposit">Deposit</MenuItem>
                  <MenuItem value="Withdraw">Withdraw</MenuItem>
                </TextField>

                {/* Bank Type */}
                <TextField
                  select
                  fullWidth
                  label="Bank Type"
                  name="bankType"
                  value={transaction.bankType}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="SameBank">Same Bank</MenuItem>
                  <MenuItem value="External">External Bank</MenuItem>
                </TextField>

                {/* External Bank Name */}
                {transaction.transactionType === "Withdraw" &&
                  (
                    <TextField
                      fullWidth
                      label="External Bank Name"
                      name="extBankName"
                      value={transaction.extBankName}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                    />
                  )}

                {/* Amount */}
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                {/* <input type="date" value={transaction.date} onChange={handleInputChange} /> */}
                <TextField
                  fullWidth
                  type="date"
                  label="Transaction Date"
                  name="date"
                  value={transaction.date}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true, // Ensures the label doesn’t overlap with the selected date
                  }}
                />
                <TextField
                  fullWidth
                  label="Note"
                  name="note"
                  value={transaction.note}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />

                {/* Submit Button */}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="#fff" />
                  ) : (
                    "Create Transaction"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactsPage;
