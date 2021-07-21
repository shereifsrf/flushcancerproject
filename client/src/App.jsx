import React from "react";
import Login from "./components/general/login/Login";
import TopNavLogin from "./components/general/topNavLogin/TopNavLogin";
import TopNavDash from "./components/home/topNav/TopNav";
import Footer from "./components/general/footer/Footer";
import MainHome from "./components/general/mainHome/MainHome";
import MainDash from "./components/home/main/Main";
import Profile from "./components/home/profile/Profile";
import Campaign from "./components/home/campaign/Campaign";
import CampaignPublic from "./components/general/campaignPublic/CampaignPublic";
import CampaignList from "./components/general/campaignPublic/CampaignList";

import { makeStyles } from "@material-ui/core/styles";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import ActionProvider from "./components/general/ActionContext";
import AuthProvider, { useAuthContext } from "./components/AuthProvider";
import UserVerification from "./components/general/userVerification/UserVerification";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
}));

const PrivateRoute = ({ children, ...rest }) => {
    const { state } = useAuthContext();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                state.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/account/login",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

const App = () => {
    const classes = useStyles();

    return (
        <AuthProvider>
            <Router>
                <div className={classes.root}>
                    <Switch>
                        <Route exact path="/" component={MainHome} />
                        <Route exact path="/account/:action">
                            <ActionProvider>
                                <TopNavLogin />
                                <Login />
                            </ActionProvider>
                        </Route>
                        <Route exact path="/user-verify/:refreshToken">
                            <UserVerification />
                        </Route>
                        <PrivateRoute exact path="/home">
                            <TopNavDash />
                            <MainDash />
                        </PrivateRoute>
                        <PrivateRoute exact path="/profile">
                            <TopNavDash />
                            <Profile />
                        </PrivateRoute>
                        <PrivateRoute exact path="/campaigns/:campaignId">
                            <TopNavDash />
                            <Campaign />
                        </PrivateRoute>
                        <PrivateRoute exact path="/campaigns">
                            <TopNavDash />
                            <Campaign />
                        </PrivateRoute>
                        <PrivateRoute
                            exact
                            path="/public-campaigns/:campaignId"
                        >
                            <TopNavDash />
                            <CampaignPublic />
                        </PrivateRoute>
                        <PrivateRoute exact path="/public-campaigns">
                            <TopNavDash />
                            <CampaignList />
                        </PrivateRoute>
                    </Switch>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
