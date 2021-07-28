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
import { useHistory } from "react-router-dom";
import { PUBLIC_CAMPAIGNS, USER_ROLE_DONOR } from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

const initData = {
    loading: false,
    donations: [],
};

export default function DonationsDash() {
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const [data, setData] = useState(initData);
    const status = state.status;
    const history = useHistory();

    useLayoutEffect(() => {
        getDonationList(dispatch);
        setData({ ...data, loading: true });
    }, []);

    useLayoutEffect(() => {
        if (data.loading) {
            if (status.getDonationListSuccess) {
                setData({
                    ...data,
                    donations: state.donations,
                    loading: false,
                });
            } else if (status.getDonationListFailed) {
                redirectToPublicCampaign();
            }
        }
    }, [state]);

    console.log(data.donations);

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
                    </Container>
                </div>
                {data.loading && (
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                )}
                {!data.loading &&
                    (status.getDonationListFailed ||
                        isEmpty(data.donations)) && (
                        <Typography
                            component="h6"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                            style={{ wordWrap: "break-word" }}
                        >
                            No donations found at the moment
                        </Typography>
                    )}
                {status.getDonationListSuccess && (
                    <List className={classes.root}>
                        {!isEmpty(data.donations) &&
                            data.donations.map((donation) => {
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
