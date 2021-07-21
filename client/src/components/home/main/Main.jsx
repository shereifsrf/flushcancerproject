import React, { useLayoutEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import DonationsDash from "./DonationsDash";
import CampaignList from "../../general/campaignPublic/CampaignList";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
    },
}));

export default function Album() {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Grid container spacing={3}>
                <Grid item md={12} lg={8}>
                    <CampaignList />
                </Grid>
                <Grid item lg={4} md={12}>
                    <DonationsDash />
                </Grid>
            </Grid>
        </>
    );
}
