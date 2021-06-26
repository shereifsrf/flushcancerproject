import React, { useContext, useReducer } from "react";
import { reducer } from "../reducer";

const AuthContext = React.createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

const initialState = {
  isAuthenticated: false,
  message: "",
  user: null,
  token: null,
  action: "",
};

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
