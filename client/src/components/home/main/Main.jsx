import React, { useLayoutEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import DonationsDash from "./DonationsDash";
import CampaignList from "../../general/campaignPublic/CampaignList";
import { Grid } from "@material-ui/core";
import { useAuthContext } from "../../AuthProvider";
import { USER_ROLE_DONOR } from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
    },
}));

export default function Album() {
    const classes = useStyles();
    const { state } = useAuthContext();

    return (
        <>
            <CssBaseline />
            <Grid container spacing={3}>
                {state.user.role !== USER_ROLE_DONOR && (
                    <Grid item md={8} lg={8}>
                        <CampaignList dashboard={true} />
                    </Grid>
                )}
                <Grid item lg={4} md={4}>
                    <DonationsDash />
                </Grid>
            </Grid>
        </>
    );
}
