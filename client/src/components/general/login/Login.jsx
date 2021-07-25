import React, { useState, useEffect } from "react";
import {
    Avatar,
    CssBaseline,
    Typography,
    Link,
    Container,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    InputLabel,
    FilledInput,
    InputAdornment,
    IconButton,
    FormControl,
    Box,
    CircularProgress,
} from "@material-ui/core";
import { Visibility, VisibilityOff, LockOutlined } from "@material-ui/icons";
import useStyles from "./loginStyles";

import { useActionContext } from "../ActionContext";
import { useAuthContext } from "../../AuthProvider";
import { useHistory, useLocation } from "react-router-dom";
import { useRef } from "react";
import AlertDialog from "../AlertDialog";
import { useLayoutEffect } from "react";
import { autoAuthenticateUser, userLogin, userRegister } from "../../../api";
import { DASHBOARD_URL } from "../../../constants";

const initData = {
    email: "",
    name: "",
    // isAgree: false,
    // isRemember: false,
    password: "",
    confPassword: "",
    showPassword: false,
    // showConfPassword: false,
    // isSubmitting: false,
    // errorMessage: null,
    // alertSuccess: false,
    // isAutoAuth: false,
    inProgress: true,
};

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
};

const Login = () => {
    const location = useLocation();
    const classes = useStyles();
    let history = useHistory();

    const [alert, setAlert] = useState(initAlert);
    const { isSignUp } = useActionContext();
    const { state, dispatch } = useAuthContext();
    const [data, setData] = useState(initData);
    const { from } = location.state || {
        from: { pathname: `/${DASHBOARD_URL}` },
    };
    const redirectTo = useRef(from);

    const status = state.status;

    useLayoutEffect(() => {
        if (
            !state.isAuthenticated &&
            !status.autoAuthenticateUserInProgress &&
            !status.autoAuthenticateUserFailed &&
            !status.autoAuthenticateUserFailedNoLocals
        ) {
            autoAuthenticateUser(dispatch);
        }
    }, [state]);

    useEffect(() => {
        // console.log(status);
        if (state.isAuthenticated) history.replace(redirectTo.current);
        else if (status.autoAuthenticateUserFailed) {
            if (!alert.open) {
                setAlert({
                    open: true,
                    title: "Error encountered",
                    contentText: state.message,
                    buttonText: "Alright",
                });
            }
            setData({ ...data, inProgress: false });
        } else if (state.hasError) {
            setData({ ...data, inProgress: false });
        }
    }, [state]);

    // useEffect(() => {
    //     if (state.hasError) {
    //         setData({
    //             ...data,
    //             isSubmitting: false,
    //             errorMessage: !data.isAutoAuth ? state.message : "",
    //         });
    //     } else if (state.isAuthenticated) {
    //         history.replace(redirectTo.current);
    //     } else if (isSignUp) {
    //         if (state.message.toLowerCase() === "success") {
    //             //        history.replace("/user-verify");
    //             setData({ ...initialState, alertSuccess: true });
    //             toggleAction();
    //         }
    //     } else if (!isSignUp) {
    //         setData({ ...data, isAutoAuth: true });
    //         autoAuthenticateUser(dispatch);
    //     }
    // }, [state]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({
            ...data,
        });

        if (isSignUp) {
            userRegister(
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                },
                dispatch
            );
        } else {
            userLogin({ email: data.email, password: data.password }, dispatch);
        }
    };

    const handleClickShowPassword = (field) => {
        let prop = `show${field.charAt(0).toUpperCase() + field.slice(1)}`;
        setData({ ...data, [prop]: !data[prop] });
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    const action = isSignUp ? "Sign Up" : "Log In";

    return (
        <>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="xs">
                {/* {data.alertSuccess && (
                    <AlertDialog
                        open={true}
                        title="Email Notification Sent"
                        contentText="An email with verification link has been sent to the email address provided."
                        buttonText="Okay"
                    />
                )} */}
                {data.inProgress && (
                    <Box justifyContent="center" display="flex">
                        Logging <CircularProgress />
                    </Box>
                )}
                {!data.inProgress && (
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar} variant="square">
                            <LockOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            {action}
                        </Typography>
                        <form
                            className={classes.form}
                            noValidate
                            onSubmit={handleSubmit}
                            method="POST"
                        >
                            {isSignUp && (
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={handleChange}
                                />
                            )}
                            {
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            }
                            <FormControl
                                variant="filled"
                                fullWidth
                                margin="normal"
                            >
                                <InputLabel required>Password</InputLabel>
                                <FilledInput
                                    name="password"
                                    type={
                                        data.showPassword ? "text" : "password"
                                    }
                                    value={data.password}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    handleClickShowPassword(
                                                        "password"
                                                    )
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                            >
                                                {data.showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {/* {isSignUp && (
                            <FormControl
                                variant="filled"
                                fullWidth
                                margin="normal"
                            >
                                <InputLabel required>
                                    Confirm Password
                                </InputLabel>
                                <FilledInput
                                    name="confPassword"
                                    type={
                                        data.showConfPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={data.confPassword}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    handleClickShowPassword(
                                                        "confPassword"
                                                    )
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                            >
                                                {data.showConfPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        )} */}
                            {/* <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label={
                                isSignUp
                                    ? "I Agree Terms & Conditions"
                                    : "Remember me"
                            }
                        /> */}
                            <Button
                                type="submit"
                                disabled={data.isSubmitting}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {/* {state.isSubmitting ? "Loading..." : action} */}
                                {action}
                            </Button>
                            <Box mb={2} color="secondary.main">
                                {data.errorMessage && (
                                    <div>{data.errorMessage}</div>
                                )}
                            </Box>
                            {/* {!isSignUp && (
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        )} */}
                        </form>
                    </div>
                )}
            </Container>
            <AlertDialog
                open={alert.open}
                title={alert.title}
                contentText={alert.contentText}
                buttonText={alert.buttonText}
                buttonFn={handleAlertOpen}
            />
        </>
    );
};

export default Login;
