import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { initState, userVerify } from "Api";
import { useAuthContext } from "../../AuthProvider";
import AlertDialog from "../AlertDialog";
import { Redirect } from "react-router-dom";
import { DASHBOARD_URL } from "../../../constants";

export default function UserVerification() {
    const { state, dispatch } = useAuthContext();
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
            {state.status.userAuthFailed && (
                <AlertDialog
                    open={true}
                    title="Email Verification Status"
                    contentText={state.message}
                    buttonText="Okay"
                    buttonFn={handleAlertBtn}
                />
            )}
            {state.status.userAuthSuccess && state.isAuthenticated && (
                <Redirect to={`/${DASHBOARD_URL}`} />
            )}
        </>
    );
}
