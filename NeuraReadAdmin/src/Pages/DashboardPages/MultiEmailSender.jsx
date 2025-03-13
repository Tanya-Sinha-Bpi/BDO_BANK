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
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalUsersList,
  SendBultEmailSlice,
} from "../../Redux/SlicesFunction/DataSlice";

const MultiEmailSender = () => {
  const dispatch = useDispatch();
  const { totalUserswithDetails, isLoading, error } = useSelector(
    (state) => state.adminStats
  );
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [transactionData, setTransactionData] = useState({
    sourceAcc: "",
    DestAccNo: "",
    amount: "",
    ServiceCh: "",
    TrDate: "",
    DestBankName: "",
  });

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
            {isLoading ? <CircularProgress size={25} color="#fff" /> : "Send Emails"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MultiEmailSender;
