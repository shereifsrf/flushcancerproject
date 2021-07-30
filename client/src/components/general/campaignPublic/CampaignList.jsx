import {
    CssBaseline,
    Grid,
    makeStyles,
    Container,
    Box,
    CircularProgress,
    Typography,
} from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import { useAuthContext } from "../../AuthProvider";
import { isEmpty } from "lodash";
import PaginationCampaign from "./PaginationCampaign";
import { useDashContext } from "../DashProvider";
import setDayWithOptions from "date-fns/esm/fp/setDayWithOptions/index.js";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

const initData = {
    campaigns: [],
};

export default function CampaignList(props) {
    const classes = useStyles();
    const [data, setData] = useState(initData);
    const { state } = useAuthContext();
    const status = state.status;
    const { data: dashData } = useDashContext();

    useLayoutEffect(() => {
        if (dashData.loading) {
            if (status.getCampaignListSuccess) {
                setData({
                    ...data,
                    campaigns: state.campaigns,
                });
            } else if (status.getCampaignListFailed) {
                console.log(state.message);
                setData({
                    ...data,
                    campaigns: state.campaigns,
                });
            }
        }
    }, [state]);

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
                    </Container>
                </div>
                {!dashData.loading &&
                    (status.getCampaignListFailed ||
                        isEmpty(data.campaigns)) && (
                        <Typography
                            component="h6"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                            style={{ wordWrap: "break-word" }}
                        >
                            No campaigns found at the moment
                        </Typography>
                    )}
                {status.getCampaignListSuccess && (
                    <Grid container spacing={2}>
                        {!isEmpty(data.campaigns) &&
                            data.campaigns.map((campaign) => {
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

                {dashData.loading && (
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                )}
                <Box display="flex" justifyContent="center" flexGrow={1}>
                    <PaginationCampaign dashboard={props.dashboard} />
                </Box>
            </Container>
        </>
    );
}
