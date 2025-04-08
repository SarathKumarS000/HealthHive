import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.authChecked = true;
    },
    logout: (state) => {
      state.user = null;
      state.authChecked = true;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
