import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateBillersSlice,
  CreateTelecomSlice,
  DeleteBillerSlice,
  DeleteTelecomSlice,
  GetAllBillerSlice,
  GetAllTelecomSlice,
  UpdateBillerSlice,
  UpdateTelecomSlice,
} from "../../Redux/SlicesFunction/DataSlice";

const  AddTelecom= () => {
  const dispatch = useDispatch();
  const { isLoading, telecomData, error } = useSelector(
    (state) => state.adminStats
  );
  const [fetchError, setFetchError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    logo: "",
    address: "",
    contactNumber: "",
    email: "",
    website: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false); // State to control modal visibility
  const [editBillerId, setEditBillerId] = useState("");
  // Fetch all biller
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        setFetchError(""); // Reset error before fetching
        await dispatch(GetAllTelecomSlice());
      } catch (err) {
        console.error("Failed to fetch billers:", err);
        setFetchError("Failed to load billers. Please try again later.");
      }
    };

    fetchBillers();
  }, [dispatch]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBillerId) {
        dispatch(UpdateTelecomSlice(formData, editBillerId)); // Update biller if editBillerId exists
      } else {
        dispatch(CreateTelecomSlice(formData)); // Create new biller
      }
      setFormData({
        title: "",
        logo: "",
        address: "",
        contactNumber: "",
        email: "",
        website: "",
      });
      dispatch(GetAllBillerSlice()); // Refresh the list after successful update/creation
      setEditModalOpen(false); // Close the modal after submit
    } catch (error) {
      console.error("Error creating or updating biller", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this biller?")) {
      try {
        dispatch(DeleteTelecomSlice(id));
      } catch (error) {
        console.error("Error deleting biller", error);
      }
    }
  };

  const handleEdit = (biller) => {
    setEditBillerId(biller._id); // Set the biller id to be edited
    setFormData({
      title: biller.title || "",
      logo: biller.logo || "",
      address: biller.address || "",
      contactNumber: biller.contactNumber || "",
      email: biller.email || "",
      website: biller.website || "",
    });
    setEditModalOpen(true); // Open the modal for editing
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Manage Billers
      </Typography>
      <Grid container spacing={3}>
        {/* Left Side: Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
            <Typography variant="h6">{editBillerId ? "Edit Telecom Provider" : "Add New Telecom Provider"}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Logo URL"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  {isLoading ? <CircularProgress size={17} /> : "Add Biller"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: List of Billers */}
        <Grid item xs={12} md={6}>
          {fetchError && <Alert severity="error">{fetchError}</Alert>}
          <Card>
            <CardContent>
              <Typography variant="h6">Telecom Provider List</Typography>

              {/* Show Loading Spinner While Fetching */}
              {isLoading ? (
                <CircularProgress />
              ) : (
                <List>
                  {/* If billers are empty or undefined, show a message */}
                  {Array.isArray(telecomData) && telecomData.length > 0 ? (
                    telecomData.map((biller) => (
                      <React.Fragment key={biller._id || Math.random()}>
                        <ListItem
                          secondaryAction={
                            <>
                              <IconButton color="primary" onClick={() => handleEdit(biller)}>
                                <Edit />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(biller._id)}
                              >
                                <Delete />
                              </IconButton>
                            </>
                          }
                        >
                          <ListItemText
                            primary={biller.title || "No Title"}
                            secondary={
                              <>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Address: {biller.address || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Contact: {biller.contactNumber || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Email: {biller.email || "N/A"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Website: {biller.website || "N/A"}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography>No billers available.</Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Edit Dailog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Biller Data</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Logo URL"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
            <DialogActions>
              <Button onClick={() => setEditModalOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {isLoading ? <CircularProgress size={17} /> : "Update Biller"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AddTelecom;
