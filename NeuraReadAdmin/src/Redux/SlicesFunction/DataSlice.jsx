import { createSlice } from "@reduxjs/toolkit";
import axiosInstances from "../../AxiosInstances/axiosInstance";
import { showSnackbar } from "./AuthSlice";

const initialState = {
  isLoading: false,
  error: false,
  totalUsers: null,
  totalUserswithDetails: [],
  adminStas: {},
  allTransactionHIstory: [],
  adminProfile: {},
  contactsByUser: {},
  billerData: [],
  telecomData: [],
  bankData: [],
};

const dataSlice = createSlice({
  name: "adminStats",
  initialState,
  reducers: {
    updateDataIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    updateTotalUsersList(state, action) {
      state.totalUsers = action.payload.totalUsers;
    },
    updateTotalUsersWithDetailsList(state, action) {
      state.totalUserswithDetails = action.payload.totalUserswithDetails;
    },
    updateAdminStats: (state, action) => {
      state.adminStas = action.payload.adminStas;
    },
    updateTransactionHistory: (state, action) => {
      state.allTransactionHIstory = action.payload.allTransactionHIstory;
    },
    getAdminProfile: (state, action) => {
      state.adminProfile = action.payload.adminProfile;
    },
    resetDataState(state) {
      // Reset dataSlice state to initialState values
      state.totalUsers = null;
      state.totalUserswithDetails = [];
      state.adminStas = {};
      state.allTransactionHIstory = [];
      state.adminProfile = {};
      state.error = false;
      state.isLoading = false;
      state.billerData = [];
      state.telecomData = [];
    },
    updateGetuserInfo: (state, action) => {
      state.contactsByUser = action.payload;
    },
    updateBillers: (state, action) => {
      state.billerData = action.payload;
    },
    updateTelecom: (state, action) => {
      state.telecomData = action.payload;
    },
    updateBank: (state, action) => {
      state.bankData = action.payload;
    },
  },
});

export default dataSlice.reducer;

export const {
  updateAdminStats,
  updateDataIsLoading,
  updateTotalUsersList,
  updateTotalUsersWithDetailsList,
  updateTransactionHistory,
  getAdminProfile,
  resetDataState,
  updateGetuserInfo,
  updateBillers,
  updateTelecom,
  updateBank,
} = dataSlice.actions;

export function fetchTotalUsersList() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));

    try {
      const response = await axiosInstances.get("admin/data/get-all-user");

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      dispatch(updateTotalUsersList({ totalUsers: response.data.totalUsers }));

      dispatch(
        updateTotalUsersWithDetailsList({
          totalUserswithDetails: response.data.data,
        })
      );
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));

      const severity = error.status || "error"; // Default to 'error' if no status
      const message = error.msg || error.message || "Login User failed";
      return Promise.reject({ severity, message });
    }
  };
}

export const removeUser = (userId) => (dispatch, getState) => {
  const { totalUserswithDetails } = getState().adminStats;

  // Filter out the deleted user
  const updatedUsers = totalUserswithDetails.filter(
    (user) => user._id !== userId
  );

  // Update Redux state with the filtered list
  dispatch(
    updateTotalUsersWithDetailsList({ totalUserswithDetails: updatedUsers })
  );
};

export function deleteUserByIdForAdmin(userId) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      if (!userId) {
        throw new Error("User ID is undefined");
      }

      const response = await axiosInstances.delete(
        `admin/data/delete-user-By-id/${userId}`
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      // After deletion, remove the user from the state
      dispatch(removeUser(userId));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "User Deleted successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data.message;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function createTransactionByAdminSlice(formValues) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      console.log("formdata in slice function", formValues);
      const response = await axiosInstances.post(
        "admin/data/create-transaction-byAdmin",
        formValues
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Transaction Created successful!";
      const severity = response.data?.status || "success";

      // Dispatch correct message and severity to Redux
      dispatch(showSnackbar({ message, severity }));

      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function getAdminStats() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("admin/data/get-admin-stats");
      dispatch(updateAdminStats({ adminStas: response.data.data }));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function createBankAccountByAdmin(formValues, userId) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        `admin/data/create-bank-account/${userId}`,
        formValues
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Something Wrong";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function GetTransactionHistoryOfUserBYAdmin(userId) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get(
        `admin/data/get-transaction-history-of-user/${userId}`
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      dispatch(
        updateTransactionHistory({
          allTransactionHIstory: response.data.transactions,
        })
      );
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Transaction Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export const removeTransaction = (id) => (dispatch, getState) => {
  const { allTransactionHIstory } = getState().adminStats;

  // Filter out the deleted transaction from the state
  const updatedTransaction = allTransactionHIstory.filter(
    (transaction) => transaction._id !== id
  );

  // Update Redux state with the filtered list
  dispatch(
    updateTransactionHistory({ allTransactionHIstory: updatedTransaction })
  );
};

export function DeleteTransactionHistoryById(id) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(
        "admin/data/delete-transaction",
        { data: { id } }
      );

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Transaction Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      dispatch(removeTransaction(id)); // This should update the state
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function GetAdminProfileData() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("admin/data/get-admin-data");
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Transaction Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(getAdminProfile({ adminProfile: response.data.user }));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function fetchTotalContactsByUser(id) {
  return async (dispatch) => {
    console.log("userId in slice fucntion", id);
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      if (!id) {
        throw new Error("User ID is undefined");
      }

      const response = await axiosInstances.get(
        `admin/data/get-single-user/${id}`
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      dispatch(updateGetuserInfo(response.data.data));
      console.log("response single user data in slice", response.data.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function updateUserData(formData, userId) {
  return async (dispatch) => {
    console.log("userId in slice fucntion", userId);
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      if (!userId) {
        throw new Error("User ID is undefined");
      }
      const response = await axiosInstances.put(
        `admin/data/edit-user-by-admin/${userId}`,
        formData
      );
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Something Wrong";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function addBalance(formData, userId) {
  return async (dispatch) => {
    // console.log("userId in slice fucntion", userId);
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      if (!userId) {
        throw new Error("User ID is undefined");
      }

      const response = await axiosInstances.post(
        `admin/data/add-user-balance/${userId}`,
        { amount: formData.amount }
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      console.log("response single user data in slice", response.data.data);
      return response.data;
    } catch (error) {
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Delete failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function CreateBillersSlice(formData) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/create-billers",
        formData
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(GetAllBillerSlice());
    } catch (error) {
      console.log("response error create biller data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function GetAllBillerSlice() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("admin/data/get-billers");
      console.log("billers data fetch in slice fucntion", response.data);
      dispatch(updateBillers(response.data.billers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.log("response error create biller data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function DeleteBillerSlice(id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(
        `admin/data/delete-billers/${id}`
      );
      const currentBillers = getState().adminStats.billerData;
      const updatedBillers = currentBillers.filter(
        (biller) => biller._id !== id
      );
      dispatch(updateBillers(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      dispatch(updateBillers(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function UpdateBillerSlice(formData, id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.put(
        `admin/data/update-biller/${id}`,
        formData
      );
      const currentBillers = getState().adminStats.billerData;
      const updatedBillers = currentBillers.map((biller) =>
        biller._id === id ? { ...biller, ...formData } : biller
      );
      dispatch(updateBillers(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      dispatch(updateBillers(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function CreateTelecomSlice(formData) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/create-telecom",
        formData
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Fetched successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(GetAllTelecomSlice());
    } catch (error) {
      console.log("response error create telecom data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function GetAllTelecomSlice() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("admin/data/get-telecom");
      // console.log("billers data fetch in slice fucntion", response.data);
      dispatch(updateTelecom(response.data.telecom));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      // console.log("response error create biller data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function DeleteTelecomSlice(id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(
        `admin/data/delete-telecom/${id}`
      );
      const currentBillers = getState().adminStats.telecomData;
      const updatedBillers = currentBillers.filter(
        (biller) => biller._id !== id
      );
      dispatch(updateTelecom(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      dispatch(updateTelecom(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function UpdateTelecomSlice(formData, id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.put(
        `admin/data/update-telecom/${id}`,
        formData
      );
      const currentBillers = getState().adminStats.telecomData;
      const updatedBillers = currentBillers.map((biller) =>
        biller._id === id ? { ...biller, ...formData } : biller
      );
      dispatch(updateBillers(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      dispatch(updateBillers(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function SendBultEmailSlice(payload) {
  return async (dispatch) => {
    console.log("payload data in slice fucntion", payload);
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/send-bulk-email",
        payload
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Email sent successfully!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      console.log("response error sending bulk email", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send email";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

//Bnak
export function CreateBankSlice(formData) {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.post(
        "admin/data/create-bank",
        formData
      );

      dispatch(updateDataIsLoading({ isLoading: false, error: false }));

      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Created successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
      dispatch(GetAllBankSlice());
    } catch (error) {
      console.log("response error create bank data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function GetAllBankSlice() {
  return async (dispatch) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.get("admin/data/get-bank-details");
      // console.log("billers data fetch in slice fucntion", response.data);
      dispatch(updateBank(response.data.banks));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      // console.log("response error create biller data", error);
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Fetching failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function UpdateBankSlice(formData, id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.put(
        `admin/data/update-bank/${id}`,
        formData
      );
      const currentBillers = getState().adminStats.bankData;
      const updatedBillers = currentBillers.map((biller) =>
        biller._id === id ? { ...biller, ...formData } : biller
      );
      dispatch(updateBank(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
      response.data?.message ||
      response.data?.msg ||
      "Data Created successful!";
    const severity = response.data?.status || "success";
    dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      dispatch(updateBank(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}

export function DeleteBankSlice(id) {
  return async (dispatch, getState) => {
    dispatch(updateDataIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axiosInstances.delete(
        `admin/data/delete-bank/${id}`
      );
      const currentBillers = getState().adminStats.bankData;
      const updatedBillers = currentBillers.filter(
        (biller) => biller._id !== id
      );
      dispatch(updateBank(updatedBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: false }));
      const message =
        response.data?.message ||
        response.data?.msg ||
        "Data Created successful!";
      const severity = response.data?.status || "success";
      dispatch(showSnackbar({ message, severity }));
    } catch (error) {
      dispatch(updateBank(currentBillers));
      dispatch(updateDataIsLoading({ isLoading: false, error: true }));
      const severity = error.response?.status || "error";
      const message =
        error.response?.data?.message || error.message || "Create failed";
      dispatch(showSnackbar({ message, severity }));
      return Promise.reject({ severity, message });
    }
  };
}
