import {
    CssBaseline,
    Grid,
    makeStyles,
    Container,
    Box,
    CircularProgress,
    Typography,
} from "@material-ui/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import { getCampaignList } from "../../../api";
import { useAuthContext } from "../../AuthProvider";
import { isEmpty } from "lodash";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

const initState = [];

export default function CampaignList(props) {
    const classes = useStyles();
    const [campaigns, setCampaigns] = useState(initState);
    const { state, dispatch } = useAuthContext();
    const status = state.status;

    useLayoutEffect(() => {
        getCampaignList(props.dashboard || false, dispatch);
    }, []);

    useEffect(() => {
        // console.log(state.campaigns);
        if (!isEmpty(state.campaigns)) setCampaigns(state.campaigns);
    }, [state]);

    // console.log(campaigns);
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
                            Campaign List
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
                {status.getCampaignListInProgress && (
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                )}
                {status.getCampaignListFailed && (
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
                {status.getCampaignListSuccess && (
                    <Grid container spacing={2}>
                        {!isEmpty(campaigns) &&
                            campaigns.map((campaign) => {
                                return (
                                    <Grid
                                        item
                                        key={campaign.id}
                                        sm={6}
                                        md={props.dashboard ? 6 : 4}
                                        lg={4}
                                    >
                                        <CampaignCard
                                            campaign={campaign}
                                            dashboard={props.dashboard}
                                        />
                                    </Grid>
                                );
                            })}
                    </Grid>
                )}
            </Container>
        </>
    );
}
