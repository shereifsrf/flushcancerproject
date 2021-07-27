import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";
import { AppBar, Toolbar, Grid, Button, IconButton } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useActionContext } from "../ActionContext";

const useStyles = makeStyles((theme) => ({
    root: {},
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

export default function TopNavLogin() {
    const { toggleAction, isSignUp } = useActionContext();
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Grid justifyContent="space-between" container>
                        <Button component={RouterLink} to="/" color="inherit">
                            FlushCancer
                        </Button>
                        <Button
                            onClick={toggleAction}
                            color="inherit"
                            variant="outlined"
                        >
                            {isSignUp ? "login" : "signup"}
                        </Button>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}
