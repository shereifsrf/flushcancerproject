import React, { useLayoutEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import { useAuthContext } from "../../AuthProvider";
import AlertDialog from "../../general/AlertDialog";
import { updateProfile } from "../../../api";

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    form: {
        marginTop: theme.spacing(8),
        "& > *": {
            marginTop: theme.spacing(2),
            width: "100%",
        },
    },
    buttons: {},
}));

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
    buttonFn: undefined,
    other: undefined,
};

const initData = {
    name: "",
    password: "",
    email: "",
    loading: false,
};

export default function Profile() {
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const [alert, setAlert] = useState(initAlert);
    const [data, setData] = useState(initData);
    console.log(state);

    useLayoutEffect(() => {
        setData({ ...data, name: state.user.name, email: state.user.email });
    }, []);

    useLayoutEffect(() => {
        if (data.loading) {
            if (state.status.updateProfileSuccess) {
                setData({
                    ...data,
                    loading: false,
                });
                setAlert({
                    open: true,
                    title: "Changes Success",
                    contentText: `Successfully updated changes`,
                    buttonText: "Great",
                });
            } else if (state.hasError) {
                setData({
                    ...data,
                    loading: false,
                });
                setAlert({
                    open: true,
                    title: "Error encountered",
                    contentText: state.message,
                    buttonText: "Alright",
                });
            }
        }
    }, [state]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSave = (e) => {
        let body = {};
        if (data.password !== "" && data.password.length > 5) {
            body["password"] = data.password;
        }
        if (data.name !== state.user.name && data.name !== "") {
            body["name"] = data.name;
        }

        updateProfile(
            {
                userId: state.user.id,
                body: { ...body },
            },
            dispatch
        );
        setData({ ...data, loading: true });
    };

    const handleCancel = (e) => {
        setData({ ...data, name: state.user.name, email: state.user.email });
    };

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    return (
        <>
            <CssBaseline />
            <AlertDialog
                open={alert.open}
                title={alert.title}
                contentText={alert.contentText}
                buttonText={alert.buttonText}
                buttonFn={alert.buttonFn || handleAlertOpen}
                other={alert.other}
            />
            {/* Hero unit */}
            <div className={classes.heroContent}>
                <Container maxWidth="md">
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >
                        Profile
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        color="textSecondary"
                        paragraph
                    >
                        Edit profile
                    </Typography>
                </Container>
                <Divider />
                <Container
                    maxWidth="sm"
                    align="center"
                    className={classes.form}
                >
                    <div>
                        <TextField
                            id="standard-read-only-input"
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <TextField
                            id="standard-read-only-input"
                            fullWidth
                            label="Email"
                            value={data.email}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>
                    <div>
                        <TextField
                            id="standard-read-only-input"
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={classes.buttons}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancel}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
        </>
    );
}
