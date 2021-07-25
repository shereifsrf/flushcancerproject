import React, { useEffect, useLayoutEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Box, CircularProgress, CssBaseline } from "@material-ui/core";
import { useAuthContext } from "../../AuthProvider";
import { getDonationList } from "../../../api";
import { isEmpty } from "lodash";
import ReceiptIcon from "@material-ui/icons/Receipt";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

const initData = [];

export default function DonationsDash() {
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const [donations, setDonations] = useState(initData);
    const status = state.status;

    useLayoutEffect(() => {
        getDonationList(dispatch);
    }, []);

    useEffect(() => {
        // console.log(state.campaigns);
        if (!isEmpty(state.donations)) setDonations(state.donations);
    }, [state]);

    // console.log(state);

    return (
        <>
            <CssBaseline />
            <Container maxWidth="lg" className={classes.root}>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            Donation List
                        </Typography>
                        {/* <Typography
                            variant="h5"
                            align="center"
                            color="textSecondary"
                            paragraph
                        >
                            Here are the Campaigns. Please view or edit as you
                            wish
                        </Typography> */}
                    </Container>
                </div>
                {status.getDonationListInProgress && (
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                )}
                {status.getDonationListFailed && (
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        style={{ wordWrap: "break-word" }}
                    >
                        Campaign List Not found
                    </Typography>
                )}
                {status.getDonationListSuccess && (
                    <List className={classes.root}>
                        {!isEmpty(donations) &&
                            donations.map((donation) => {
                                // console.log(donation);
                                return (
                                    <div key={donation.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <ReceiptIcon />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={donation.campaign.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={
                                                                classes.inline
                                                            }
                                                            color="textPrimary"
                                                        >
                                                            Donation: $
                                                        </Typography>
                                                        {donation.amount}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider
                                            variant="inset"
                                            component="li"
                                        />
                                    </div>
                                );
                            })}
                    </List>
                )}
            </Container>
        </>
    );
}
