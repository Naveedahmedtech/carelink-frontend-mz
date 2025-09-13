import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICES_PATH } from "../../constant/REDUCER_PATH";

// Define user roles
export type Role = "PARTICIPANT" | "TRAINER" | "ADMIN";

// Define what userData looks like
interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role: Role; // 👈 core field for role-based dashboard
  token?: string;
  isLoggedIn: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  userData: UserData;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: { isLoggedIn: false, role: "PARTICIPANT" }, // default role = PARTICIPANT
};

const authSlice = createSlice({
  name: SLICES_PATH.AUTH_SLICE,
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserData>) {
      state.isLoggedIn = true;
      state.userData = { ...action.payload, isLoggedIn: true };
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.userData = { isLoggedIn: false, role: "PARTICIPANT" };
    },
    updateUserData(state, action: PayloadAction<Partial<UserData>>) {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { loginSuccess, logoutSuccess, updateUserData } =
  authSlice.actions;

export default authSlice.reducer;
