import { createSlice } from "@reduxjs/toolkit";
import axiosInstances from "../../AxiosInstances/axiosInstance";
import { resetDataState } from "./DataSlice";
import { jwtDecode } from "jwt-decode";
const initialState = {
  isLoading: false,
  isLoggedIn: false,
  error: false,
  adminData: {},
  snackbar: {
    open: false,
    severity: null,
    message: null,
  },
  sessionTime: null,
};

const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openSnackBar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    CloseSnackBar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
      state.snackbar.severity = null;
    },
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.adminData = action.payload.adminData || null;
    },
    logout: (state) => {
      // Reset everything to initial state on logout
      state.isLoggedIn = false;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.adminData = {};
      state.snackbar = {
        open: false,
        severity: null,
        message: null,
      };
    },
    updateSessionTime: (state, action) => {
      state.sessionTime = action.payload.sessionTime;
    },
  },
});

export default authSlices.reducer; // ✅ Now exported as `authSlice.reducer`
export const {
  updateIsLoading,
  openSnackBar,
  CloseSnackBar,
  login,
  logout,
  updateSessionTime,
} = authSlices.actions;

export function LogoutUser() {
  return async (dispatch) => {
    try {
      const response = await axiosInstances.post("/auth/user/logout");

      dispatch(logout());
      dispatch(resetDataState());
      // Use API response message dynamically
      const message =
        response.data?.message || response.data?.msg || "Logout successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Logout failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export const showSnackbar =
  ({ severity, message }) =>
  (dispatch) => {
    dispatch(openSnackBar({ message, severity }));

    setTimeout(() => {
      dispatch(CloseSnackBar());
    }, 4000);
  };

export function LoginUser(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post("admin/data/login-admin", {
        ...formValues,
      });
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      dispatch(
        login({
          isLoggedIn: true,
          adminData: response.data.user,
        })
      );
      const message =
        response.data?.message || response.data?.msg || "Login successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      // console.log("response in slice", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function RegisterUser(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.post(
        "auth/user/register",
        formValues
      );

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Registration successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      // Log the entire error response to understand its structure
      // console.log('Full error response:', error.response);

      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Registration failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function ForgotPasswordFunction(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.post(
        "/auth/mobile-forgot-password",
        { email: formValues }, // Ensure this is the correct format
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Otp sent successful in your Email!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Failed to send OTP";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function VerifyOtpFunction(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    console.log("formvalues in slice fucntion:-", formValues);
    try {
      const response = await axiosInstances.post(
        "/auth/mobile-reset-password",
        formValues
      );

      dispatch(updateIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Passowrd Reset Successfully!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Failed to send OTP";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function CreateUserByAdmin(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/create-user-byAdmin",
        formValues
      );
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "User Created successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function BlockUserByAdmin(userId) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.put(
        `admin/data/block-user/${userId}`
      );
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "User Blocked successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      console.log("response blocking", response.data);
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "User Blocking failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function UNBlockUserByAdmin(userId) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.put(
        `admin/data/unblock-user/${userId}`
      );
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "User UnBlocked successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "User UnBlocking failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

export function ResetAdminPassowrd(formValues) {
  return async (dispatch) => {
    dispatch(updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/admin-password-reset",
        formValues
      );
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "User UnBlocked successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));
      return response.data;
    } catch (error) {
      dispatch(updateIsLoading({ isLoading: false, error: false }));
      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "User UnBlocking failed";

      // Dispatch correct error message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return Promise.reject({ severity, message });
    }
  };
}

// const checkTokenExpiration = (token, dispatch) => {
//   if (!token) return true;

//   try {
//     const decoded = jwt_decode(token); // Decode the token
//     const currentTime = Date.now() / 1000; // Get current time in seconds
//     console.log("decoded time", decoded.exp);

//     // Dispatch session time to store the expiration time in Redux state
//     dispatch(updateSessionTime({ sessionTime: decoded.exp * 1000 })); // *1000 to convert to milliseconds

//     // Return true if the token is expired
//     return decoded.exp < currentTime;
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return true;
//   }
// };

export const checkAndLogoutIfTokenExpired = () => {
  return (dispatch) => {
    const token = localStorage.getItem("refreshToken"); // Get token from localStorage

    if (checkTokenExpiration(token, dispatch)) {
      dispatch(logout()); // Dispatch logout action if token is expired
    }
  };
};

const getTokenExpirationTime = (token) => {
  try {
    const decoded = jwtDecode(token);  // Decode the token (no need for `{ header: true }`)
    console.log("Decoded Token:", decoded);
    return decoded.exp * 1000; 
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const checkTokenExpiration = (dispatch, token) => {
  if (!token) {
    return null;  // If no token, return null
  }

  const expirationTime = getTokenExpirationTime(token);  // Should return a number in milliseconds


  if (expirationTime) {
    // Dispatch session expiration time to Redux
    dispatch(updateSessionTime({ sessionTime: expirationTime }));
  }

  const currentTime = Date.now();
  return expirationTime && expirationTime < currentTime;
};