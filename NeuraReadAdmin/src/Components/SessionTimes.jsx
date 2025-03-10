import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"; // Import your logout action
import {
  checkTokenExpiration,
  logout,
} from "../Redux/SlicesFunction/AuthSlice";
import { Typography } from "@mui/material";

const SessionTimer = () => {
  const dispatch = useDispatch();
  const [remainingTime, setRemainingTime] = useState(0);

  // Access sessionTime and token from Redux store
  const sessionTime = useSelector((state) => state.auth.sessionTime);
  const token = useSelector((state) => state.auth.adminData.token);
  console.log("session time ", sessionTime);
  useEffect(() => {
    if (token) {
      // Check token expiration and update session time in Redux (this will handle dispatch)
      checkTokenExpiration(dispatch, token);
    }
  }, [token, dispatch]);// Re-run when token changes

  useEffect(() => {
    if (sessionTime) {
      const calculateRemainingTime = () => {
        const currentTime = Date.now(); // Get current time in milliseconds
        const timeLeft = sessionTime - currentTime; // Calculate remaining time

        if (timeLeft <= 0) {
          // Session expired, log out the user
          dispatch(logout()); // Dispatch the logout action
          clearInterval(timerInterval); // Stop the interval
        } else {
          setRemainingTime(timeLeft); // Update the remaining time
        }
      };

      const timerInterval = setInterval(calculateRemainingTime, 1000); // Run every second

      // Cleanup interval on component unmount
      return () => clearInterval(timerInterval);
    }
  }, [dispatch, sessionTime]); // Re-run the effect when sessionTime changes

  const getFormattedTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      {remainingTime > 0 ? (
        <Typography variant="body1" color="textSecondary">
          Session Time: {getFormattedTime(remainingTime)}
        </Typography>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Your session has expired.
        </Typography>
      )}
    </div>
  );
};

export default SessionTimer;
