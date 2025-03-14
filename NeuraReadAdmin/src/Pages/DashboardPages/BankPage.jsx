import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { CreateBankSlice, DeleteBankSlice, GetAllBankSlice, UpdateBankSlice } from "../../Redux/SlicesFunction/DataSlice";
const BankPage = () => {
  const dispatch = useDispatch();
  const { isLoading, bankData } = useSelector((state) => state.adminStats);
  // Sample Bank Data
  console.log("bank data in page", bankData);

  const banks = Array.isArray(bankData) ? bankData : [];
  // Form State
  const [formData, setFormData] = useState({
    title: "",
  });
  const [openDialog, setOpenDialog] = useState(false); // For managing dialog visibility
  const [editingBank, setEditingBank] = useState(null); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [status, setStatus] = useState("active");

  // Handle Add Bank
  const handleAddBank = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Submitting bank:", formData);
    try {
      dispatch(CreateBankSlice(formData));
      setFormData({ title: "" }); // Clear input after submission
    } catch (error) {
      console.log("Error adding bank:", error);
    }
  };
  // Handle Delete
  const handleDelete = (id) => {
    dispatch(DeleteBankSlice(id))
  };

  const handleEditClick = (bank) => {
    setEditingBank(bank);
    setFormData({ title: bank.title });
    setOpenDialog(true);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(UpdateBankSlice(formData, editingBank._id));
      setOpenDialog(false);
      setFormData({ title: "" });
    } catch (error) {
      console.log("Error editing bank:", error);
    }
  };

  useEffect(()=>{
    dispatch(GetAllBankSlice());
  },[dispatch])

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Side - Bank List */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bank List
            </Typography>
            {isLoading ? (
              <Typography>Loading banks...</Typography>
            ) : banks.length === 0 ? (
              <Typography>No banks available.</Typography>
            ) : (
              <List>
                {banks.map((bank) => (
                  <ListItem
                    key={bank._id}
                    sx={{
                      bgcolor: bank.status === "active" ? "#e8f5e9" : "#ffebee",
                      mb: 1,
                      borderRadius: 2,
                    }}
                  >
                    <ListItemText
                      primary={bank.title}
                      secondary={`Status: ${bank.status}`}
                    />
                    <ListItemSecondaryAction>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditClick(bank)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(bank._id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>

        {/* Right Side - Create New Bank */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Bank
            </Typography>
            <form onSubmit={handleAddBank}>
              <TextField
                label="Bank Name"
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              {/* Ensure button type="submit" inside <form> */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit" // Correct way when inside a <form>
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Add Bank"
                )}
              </Button>
            </form>
          </Card>
        </Grid>
      </Grid>
      {/* Edit Bank Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Bank</DialogTitle>
        <DialogContent>
          <TextField
            label="Bank Name"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BankPage;
