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
    password: "",
    confPassword: "",
    showPassword: false,
    errorMessage: null,
    inProgress: false,
    nonPrompt: false,
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
        if (!isSignUp) {
            autoAuthenticateUser(dispatch);
            setData({ ...data, inProgress: true, nonPrompt: true });
        }
    }, []);

    useLayoutEffect(() => {
        if (
            data.nonPrompt &&
            (status.autoAuthenticateUserFailed ||
                status.autoAuthenticateUserFailedNoLocals)
        ) {
            setData({ ...data, inProgress: false, nonPrompt: false });
        } else if (status.userRegisterSuccess && data.inProgress) {
            setAlert({
                open: true,
                title: "Registration Success",
                contentText: "Please check your email for verification",
                buttonText: "Alright",
            });
            setData({ ...initData, inProgress: false });
        } else if (state.isAuthenticated) {
            history.replace(redirectTo.current);
        } else if (
            state.hasError &&
            !(
                status.autoAuthenticateUserFailed ||
                status.autoAuthenticateUserFailedNoLocals
            )
        ) {
            if (!alert.open) {
                setAlert({
                    open: true,
                    title: "Error encountered",
                    contentText: state.message,
                    buttonText: "Alright",
                });
            }
            setData({ ...data, inProgress: false });
        }
    }, [state]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({
            ...data,
            inProgress: true,
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

                            <Button
                                type="submit"
                                disabled={data.isSubmitting}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                {action}
                            </Button>
                            {!isSignUp && (
                                <Box mb={2} color="secondary.main">
                                    {data.errorMessage && (
                                        <div>{data.errorMessage}</div>
                                    )}
                                </Box>
                            )}
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
