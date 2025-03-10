import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteDBDuplicateIndexSlice,
  GetDBDuplicateIndexSlice,
} from "../../Redux/SlicesFunction/AuthSlice";

const DuplicateFinder = () => {
  const dispatch = useDispatch();
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false); // Controls CircularProgress
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { isLoading, error } = useSelector((state) => state.auth);

  // Handle button click to fetch duplicate indexes
  const handleFetchDuplicateIndexes = async () => {
    setLoading(true);
    try {
      const data = await dispatch(GetDBDuplicateIndexSlice());
      if (data?.data) {
        setDuplicates(data.data);
      }
    } catch (error) {
      setSnackbarMessage("Failed to fetch duplicate indexes");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle index deletion
  const handleDelete = async () => {
    if (selectedIndex) {
      const formValues = {
        ns: selectedIndex._id.ns,
        indexName: selectedIndex._id.name,
      };
      const response = await dispatch(DeleteDBDuplicateIndexSlice(formValues));

      if (response?.status === "success") {
        setSnackbarMessage(
          `Successfully deleted duplicate index: ${selectedIndex._id.name}`
        );
      } else {
        setSnackbarMessage(`Failed to delete index: ${selectedIndex._id.name}`);
      }
      setOpenSnackbar(true);
      // Refresh the list after deletion
      const data = await dispatch(GetDBDuplicateIndexSlice());
      if (data?.data) {
        setDuplicates(data.data);
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Duplicate Index Finder
      </Typography>

      {/* Button to fetch data */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleFetchDuplicateIndexes}
        disabled={loading} // Disable button while loading
        sx={{marginY:5}}
      >
        {loading ? "Fetching..." : "Fetch Duplicate DB Indexes"}
      </Button>

      {/* Display CircularProgress when loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="duplicate indexes table">
            <TableHead>
              <TableRow>
                <TableCell>Namespace</TableCell>
                <TableCell>Index Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {duplicates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No duplicate indexes found</TableCell>
                </TableRow>
              ) : (
                duplicates.map((duplicate, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() => setSelectedIndex(duplicate)}
                    selected={selectedIndex === duplicate}
                  >
                    <TableCell>{duplicate._id.ns}</TableCell>
                    <TableCell>{duplicate._id.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setSelectedIndex(duplicate)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedIndex && (
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Selected Index
          </Button>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default DuplicateFinder;
