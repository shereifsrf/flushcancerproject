import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Button,
    IconButton,
    Toolbar,
    Collapse,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link as Scroll } from "react-scroll";
import { DASHBOARD_URL } from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Nunito",
    },
    appbar: {
        background: "none",
    },
    appbarWrapper: {
        width: "80%",
        margin: "0 auto",
    },
    appbarTitle: {
        flexGrow: "1",
    },
    icon: {
        color: "#FFF",
        fontSize: "1rem",
        fontWeight: "500",
        borderColor: theme.palette.primary.main,
        border: "2px solid",
    },
    colorText: {
        color: theme.palette.primary.light,
    },
    container: {
        textAlign: "center",
    },
    title: {
        color: "#fff",
        fontSize: "4.5rem",
    },
    goDown: {
        color: theme.palette.primary.light,
        fontSize: "4rem",
    },
}));
export default function Header() {
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        setChecked(true);
    }, []);
    const history = useHistory();

    return (
        <div className={classes.root} id="header">
            <AppBar className={classes.appbar} elevation={0}>
                <Toolbar className={classes.appbarWrapper}>
                    <h1 className={classes.appbarTitle}>
                        Flush<span className={classes.colorText}>Cancer</span>
                    </h1>
                    <Button
                        onClick={() => history.replace(`/${DASHBOARD_URL}`)}
                        color="inherit"
                        className={classes.icon}
                        variant="outlined"
                    >
                        Account
                    </Button>
                </Toolbar>
            </AppBar>

            <Collapse
                in={checked}
                {...(checked ? { timeout: 1000 } : {})}
                collapsedHeight={50}
            >
                <div className={classes.container}>
                    <h1 className={classes.title}>
                        Children needs <br />
                        Your<span className={classes.colorText}> Help.</span>
                    </h1>
                    <Scroll to="place-to-visit" smooth={true}>
                        <IconButton>
                            <ExpandMoreIcon className={classes.goDown} />
                        </IconButton>
                    </Scroll>
                </div>
            </Collapse>
        </div>
    );
}
