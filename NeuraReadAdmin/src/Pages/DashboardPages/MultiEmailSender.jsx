import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalUsersList,
  SendBultEmailSlice,
  SendPromoEmailSlice,
} from "../../Redux/SlicesFunction/DataSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const MultiEmailSender = () => {
  const dispatch = useDispatch();
  const { totalUserswithDetails, isLoading, error } = useSelector(
    (state) => state.adminStats
  );
  const [openBulkEmail, setOpenBulkEmail] = useState(false);
  const [openPromoEmail, setOpenPromoEmail] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [transactionData, setTransactionData] = useState({
    sourceAcc: "",
    DestAccNo: "",
    amount: "",
    ServiceCh: "",
    TrDate: "",
    DestBankName: "",
  });
  const [promoFormData,setPromoFormData] = useState({
    sub: "",
    image: null,
  })
  useEffect(() => {
    dispatch(fetchTotalUsersList());
  }, [dispatch]);

  const users = totalUserswithDetails || [];
  const handleUserSelection = (userId) => {
    setSelectedUserIds((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      selectedUsers: selectedUserIds,
      transactionDetails: transactionData,
    };
    // console.log('paylod in frontned',payload);
    await dispatch(SendBultEmailSlice(payload));
  };

  const handlePromoInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (files) {
      // ✅ Properly set image file
      setPromoFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setPromoFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePromoSubmit = async () => {
    if (!promoFormData.image || !promoFormData.sub || selectedUserIds.length === 0) {
      console.error("Missing required fields.");
    }
  
    const formData = new FormData();
    formData.append("image", promoFormData.image); // Append the image file
    formData.append("subject", promoFormData.sub); // Append the subject
  
    // Append each selected user ID to FormData
    selectedUserIds.forEach((id) => {
      formData.append("selectedUsers[]", id); // Use "selectedUsers[]" to match the backend field name
    });
  
    try {
      const response = await dispatch(SendPromoEmailSlice(formData)); // Dispatch the promo email slice
      console.log("Promo email sent:", response);
    } catch (error) {
      console.error("Error sending promo email:", error);
    }
  };
  
  
  
  return (
    <Grid container spacing={3}>
      {/* Left Side: User List with Multi-Select */}
      <Grid item xs={12} md={4}>
        <Box sx={{ borderRight: 1, paddingRight: 2 }}>
          <Typography variant="h6">Select Users</Typography>
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : users.length === 0 ? (
            <Typography>No users found</Typography>
          ) : (
            users.map((user) => (
              <FormControlLabel
                key={user._id}
                control={
                  <Checkbox
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                }
                label={`${user.firstName} ${user.lastName} - ${user.email}`}
              />
            ))
          )}
        </Box>
      </Grid>

      {/* Right Side: Transaction Form */}
      <Grid item xs={12} md={8}>
        <Box sx={{ paddingLeft: 2 }}>
          <Typography variant="h6">Actions</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenBulkEmail(!openBulkEmail)}
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            {openBulkEmail ? "Close Bulk Email Form" : "Send Bulk Email"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenPromoEmail(!openPromoEmail)}
            sx={{ marginTop: 2 }}
          >
            {openPromoEmail
              ? "Close Promo Email Form"
              : "Send Promotional Email"}
          </Button>
          <Collapse in={openBulkEmail}>
            <Box
              sx={{
                marginTop: 3,
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Transaction Details</Typography>
              <TextField
                label="Source Account"
                name="sourceAcc"
                value={transactionData.sourceAcc}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Destination Account Number"
                name="DestAccNo"
                value={transactionData.DestAccNo}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={transactionData.amount}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Service Charge"
                name="ServiceCh"
                type="number"
                value={transactionData.ServiceCh}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Transaction Date"
                name="TrDate"
                type="date"
                value={transactionData.TrDate}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Destination Bank Name"
                name="DestBankName"
                value={transactionData.DestBankName}
                onChange={handleTransactionChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ marginTop: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={25} color="#fff" />
                ) : (
                  "Send Emails"
                )}
              </Button>
            </Box>
          </Collapse>
          <Collapse in={openPromoEmail}>
            <Box
              sx={{
                marginTop: 3,
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6">Promotional Email</Typography>
              <TextField
                label="Subject"
                name="sub"
                value={promoFormData.sub}
                onChange={handlePromoInputChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                component="label"
                sx={{ marginTop: 2, display: "flex", alignItems: "center" }}
              >
                <CloudUploadIcon sx={{ marginRight: 1 }} />
                Upload Image
                <input
                  type="file"
                  hidden
                  name="image"
                  onChange={handlePromoInputChange}
                  accept="image/*"
                />
              </Button>
              {promoFormData.image && (
                <Typography sx={{ marginTop: 1 }}>
                  Selected: {promoFormData.image.name}
                </Typography>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePromoSubmit} 
                sx={{ marginTop: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={25} color="#fff" />
                ) : (
                  "Send Promo Emails"
                )}
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MultiEmailSender;
