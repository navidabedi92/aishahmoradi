const { createSlice, configureStore } = require("@reduxjs/toolkit");

let initialState = {
  userData: { Firstname: null, Lastname: null, MemberID: null, Type: null },
  login: false,
};

// Function to get stored state from local storage
const getStoredState = () => {
  if (typeof window !== "undefined") {
    // Check if window is defined
    const storedData = localStorage.getItem("userLoginData");
    if (storedData) {
      const { userData, login, timestamp } = JSON.parse(storedData);
      // Check if the stored data is still valid (within 1 hour)
      if (Date.now() - timestamp < 3600000) {
        // 1 hour in milliseconds
        return { userData, login };
      }
    }
  }
  return initialState; // Return initial state if no valid data
};

const slicerAi = createSlice({
  name: "AiLogin",
  initialState: typeof window !== "undefined" ? getStoredState() : initialState, // Initialize state from local storage only on client
  reducers: {
    setUserLogin(state, action) {
      state.userData = action.payload.userData;
      state.login = action.payload.login;
      console.log(action.payload.login);
      // Save to local storage with a timestamp
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userLoginData",
          JSON.stringify({
            userData: action.payload.userData,
            login: action.payload.login,
            timestamp: Date.now(),
          })
        );
      }
    },
    clearUserLogin(state) {
      state.userData = initialState.userData;
      state.login = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userLoginData"); // Clear local storage on logout
      }
    },
  },
});

export const Store = configureStore({ reducer: slicerAi.reducer });

export const SliceAction = slicerAi.actions;
