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
import { clearStatus, getCampaignList } from "../../../api";
import { useAuthContext } from "../../AuthProvider";
import { isEmpty } from "lodash";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },
}));

const initData = {
    loading: false,
    campaigns: [],
};

export default function CampaignList(props) {
    const classes = useStyles();
    const [data, setData] = useState(initData);
    const { state, dispatch } = useAuthContext();
    const status = state.status;

    useLayoutEffect(() => {
        clearStatus(dispatch);
        getCampaignList(props.dashboard, dispatch);
        setData({ ...data, loading: true });
    }, []);

    useLayoutEffect(() => {
        if (data.loading) {
            if (status.getCampaignListSuccess) {
                setData({
                    ...data,
                    loading: false,
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
                {data.loading && (
                    <Box justifyContent="center" display="flex">
                        <CircularProgress />
                    </Box>
                )}
                {!data.loading &&
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
            </Container>
        </>
    );
}
