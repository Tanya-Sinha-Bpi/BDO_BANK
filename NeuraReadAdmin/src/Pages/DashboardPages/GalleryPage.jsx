import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteTransactionHistoryById,
  GetTransactionHistoryOfUserBYAdmin,
} from "../../Redux/SlicesFunction/DataSlice";

const GalleryPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, error, allTransactionHIstory } = useSelector(
    (state) => state.adminStats
  );

  useEffect(() => {
    if (userId) {
      dispatch(GetTransactionHistoryOfUserBYAdmin(userId));
    }
  }, [userId, dispatch]);

  console.log("total transaction by user", allTransactionHIstory);

  const handleDeleteTransaction = (id) => {
    console.log('Deleting transaction with id:', id);
    // Dispatch delete action (assuming delete is asynchronous)
    dispatch(DeleteTransactionHistoryById(id));
    // Optionally, you can toggle isLoading here if you're handling async actions
  };

  const renderTransactionDetails = (transaction) => {
    const isSameBank = transaction.bankType === "SameBank";
    return (
      <Card
        key={transaction._id}
        sx={{ boxShadow: 3, borderRadius: 3, marginBottom: 2 }}
      >
        <CardContent>
          <Typography variant="h6" color="textPrimary">
            Transaction ID: {transaction.transactionId}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Type: {transaction.transactionType}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Amount: {transaction.amount} PHP
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Status: {transaction.status}
          </Typography>
          <Typography variant="body2" color="textPrimary">
            Date: {new Date(transaction.transactionDate).toLocaleString()}
          </Typography>

          {isSameBank ? (
            <>
              <Typography variant="body2" color="textPrimary">
                From: {transaction.fromAccount.accountName} (Account No:{" "}
                {transaction.fromAccount.accountNumber})
              </Typography>
              <Typography variant="body2" color="textPrimary">
                To: {transaction.toAccount} (Account ID: {transaction.toAccount}
                )
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2" color="textPrimary">
                From: {transaction.fromAccount.accountName} (Account No:{" "}
                {transaction.fromAccount.accountNumber})
              </Typography>
              <Typography variant="body2" color="textPrimary">
                To: {transaction.receiverDetails.accountName} (Account No:{" "}
                {transaction.receiverDetails.accountNumber})
              </Typography>
              <Typography variant="body2" color="textPrimary">
                Bank: {transaction.externalBankDetails.bankName}
              </Typography>
              <Typography variant="body2" color="textPrimary">
                External Bank Account Number:{" "}
                {transaction.externalBankDetails.accountNumber}
              </Typography>
            </>
          )}

          {transaction.note && (
            <Typography variant="body2" color="textSecondary">
              Note: {transaction.note}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          {/* Add any action buttons if necessary */}
          <Button size="small" color="primary" onClick={() => handleDeleteTransaction(transaction._id)}>
            {isLoading? <CircularProgress size={18} /> :'Delete'} 
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 3 }}>
        User Transaction History
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="h6" color="error">
          Failed to fetch transaction history. Please try again later.
        </Typography>
      )}

      {/* Render transactions */}
      <Box>
        {!isLoading && !error && allTransactionHIstory?.length > 0
          ? allTransactionHIstory.map((transaction) =>
              renderTransactionDetails(transaction)
            )
          : !isLoading &&
            !error && (
              <Typography variant="h6" color="textSecondary">
                No transactions available for this user.
              </Typography>
            )}
      </Box>
    </Container>
  );
};

export default GalleryPage;
