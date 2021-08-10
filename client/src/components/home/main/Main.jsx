import React, { useLayoutEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import DonationsDash from "./DonationsDash";
import CampaignList from "../../general/campaignPublic/CampaignList";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { useAuthContext } from "../../AuthProvider";
import { findRedirection } from "../../../api";
import { PUBLIC_CAMPAIGNS } from "../../../constants";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(8),
    },
}));

export default function Album() {
    const classes = useStyles();
    const [redirect, setRedirect] = useState(false);
    const { state, dispatch } = useAuthContext();

    useLayoutEffect(() => {
        findRedirection(dispatch);
    }, []);

    useLayoutEffect(() => {
        if (state.status.getRedirectSuccess) {
            setRedirect(state.redirect);
        }
    }, [state]);

    return (
        <>
            <CssBaseline />
            {!redirect && (
                <Container maxWidth="sm">
                    <Box display="flex" mt={4} justifyContent="center">
                        <Typography variant="h6">No contents here</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h6">
                            <Link to={PUBLIC_CAMPAIGNS}>
                                Click here to browse campaigns for donation
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            )}
            {redirect && (
                <Grid container spacing={3}>
                    <Grid item md={8} lg={8}>
                        <CampaignList dashboard={true} />
                    </Grid>
                    <Grid item lg={4} md={4}>
                        <DonationsDash />
                    </Grid>
                </Grid>
            )}
        </>
    );
}
