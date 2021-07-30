import React, { useLayoutEffect, useState } from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { useHistory, useLocation } from "react-router-dom";
import {
    CAMPAIGNS_URL,
    DASHBOARD_URL,
    PUBLIC_CAMPAIGNS,
    USER_LOGOUT,
} from "../../../constants";
import { useAuthContext } from "../../AuthProvider";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import PublicIcon from "@material-ui/icons/Public";
import { Box, Button } from "@material-ui/core";
import DrawerFilter from "./DrawerFilter";
import { useDashContext } from "../../general/DashProvider";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
    landingPageLink: {
        textDecoration: "none",
        "&:visited": {
            color: "inherit",
        },
    },
}));

export default function TopNav(props) {
    const history = useHistory();
    const classes = useStyles();
    const { dispatch } = useAuthContext();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const { data: dashData, setData: setDashData } = useDashContext();
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [filter, setFilter] = useState(false);
    const [search, setSearch] = useState(dashData.search || "");

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePublicCampaign = () => history.push(`/${PUBLIC_CAMPAIGNS}`);

    const handleCreateCampaign = () => history.replace(`/${CAMPAIGNS_URL}`);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(search);
        setDashData({ ...dashData, search, trigger: true });
    };

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    useLayoutEffect(() => {
        setSearch("");
    }, [props.dashboard]);

    const handleFilter = () => {
        setFilter((filter) => !filter);
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    history.replace("/profile");
                }}
            >
                Profile
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    history.push(`/${DASHBOARD_URL}`);
                }}
            >
                Dashboard
            </MenuItem>
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    dispatch({
                        type: USER_LOGOUT,
                    });
                    history.replace("/");
                }}
            >
                Logout
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handlePublicCampaign}>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    {/* <Badge badgeContent={4} color="secondary"> */}
                    <PublicIcon />
                    {/* </Badge> */}
                </IconButton>
                <p>Public Campaigns</p>
            </MenuItem>
            <MenuItem onClick={handleCreateCampaign}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AddIcon />
                </IconButton>
                <p>Create Campaign</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div>
            <AppBar position="static" className={classes.grow}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        <RouterLink to="/" className={classes.landingPageLink}>
                            FlushCancer
                        </RouterLink>
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex">
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    value={search}
                                    name="search"
                                    onChange={handleChange}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </div>
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleFilter}
                                >
                                    Filters
                                </Button>
                            </Box>
                        </Box>
                    </form>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handlePublicCampaign}
                            color="inherit"
                        >
                            <PublicIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            onClick={handleCreateCampaign}
                        >
                            <AddIcon />
                        </IconButton>

                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <DrawerFilter open={filter} setOpen={handleFilter} />
        </div>
    );
}
