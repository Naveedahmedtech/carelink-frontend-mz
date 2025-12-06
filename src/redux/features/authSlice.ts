import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICES_PATH } from "../../constant/REDUCER_PATH";

export type Role = "PARTICIPANT" | "TRAINER" | "ADMIN";

interface UserData {
  id: string;
  name: string;    // ← not optional
  email: string;   // ← not optional
  role: Role;
  token?: string;  // token can remain optional
  isLoggedIn: boolean; // (you can keep this for now if you like)
}

interface AuthState {
  isLoggedIn: boolean;
  userData: UserData;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: {
    id: "",
    name: "",              // ← default empty string
    email: "",             // ← default empty string
    role: "PARTICIPANT",
    token: undefined,
    isLoggedIn: false,
  },
};

const authSlice = createSlice({
  name: SLICES_PATH.AUTH_SLICE,
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserData>) {
      state.isLoggedIn = true;
      // ensure we never lose defaults if payload misses something
      state.userData = { ...initialState.userData, ...action.payload, isLoggedIn: true };
    },
    logoutSuccess(state) {
      state.isLoggedIn = false;
      state.userData = { ...initialState.userData }; // reset to safe defaults
    },
    updateUserData(state, action: PayloadAction<Partial<UserData>>) {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { loginSuccess, logoutSuccess, updateUserData } = authSlice.actions;
export default authSlice.reducer;
