import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import {
    useHistory,
    useParams,
    useRouteMatch,
    generatePath,
    useLocation,
} from "react-router-dom";
import { DASHBOARD_URL } from "../../constants";

export const ActionContext = React.createContext();

export function useActionContext() {
    return useContext(ActionContext);
}

export default function ActionProvider({ children }) {
    //TODO: this renders 2 times in initial
    let { action } = useParams();
    const [isSignUp, setIsSignup] = useState(action === "signup");
    const history = useHistory();
    const location = useLocation();
    const path = useRouteMatch().path;

    let { from } = location.state || {
        from: { pathname: `/${DASHBOARD_URL}` },
    };

    useEffect(() => {
        let customPath = generatePath(path, {
            action: isSignUp ? "signup" : "login",
        });
        history.replace(customPath);
    }, [isSignUp, history, path]);

    const toggleAction = (e) => {
        setIsSignup((prev) => !prev);
    };

    return (
        <ActionContext.Provider value={{ isSignUp, toggleAction, from }}>
            {children}
        </ActionContext.Provider>
    );
}
