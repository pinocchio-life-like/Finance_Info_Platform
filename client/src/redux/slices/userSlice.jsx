import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { firstName: null, userName: null, userRole: null },
  reducers: {
    login: (state, action) => {
      console.log("from redux", action.payload);
      state.firstName = action.payload.firstName;
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
    },
    logout: (state) => {
      state.firstName = null;
      state.userName = null;
      state.userRole = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
