import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { initState, userVerify } from "../../../api";
import { COMPLETED, FAILED } from "../../../constants";
import { useAuthContext } from "../../AuthProvider";
import AlertDialog from "../AlertDialog";
import { Redirect } from "react-router-dom";

export default function UserVerification() {
  const { dispatch, state } = useAuthContext();
  const { refreshToken } = useParams();
  const history = useHistory();

  useEffect(() => {
    userVerify({ refreshToken }, dispatch);
  }, []);

  const handleAlertBtn = () => {
    initState(dispatch);
    history.replace("/");
  };

  return (
    <>
      {state.status === FAILED && (
        <AlertDialog
          open={true}
          title="Email Verification Status"
          contentText={state.message}
          buttonText="Okay"
          buttonFn={handleAlertBtn}
        />
      )}
      {state.status === COMPLETED && state.isAuthenticated && (
        <Redirect to="/home" />
      )}
    </>
  );
}
