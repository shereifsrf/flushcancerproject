import React, { useCallback, useLayoutEffect, useState } from "react";
import {
    CssBaseline,
    Box,
    Grid,
    Container,
    InputAdornment,
    OutlinedInput,
    InputLabel,
    FormControl,
    Button,
    Link,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BG from "../../../images/island1.jpg";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ShareIcon from "@material-ui/icons/Share";
import { campaigns } from "../../../dummyData";
import { Link as RouterLink, useParams } from "react-router-dom";
import { limitCharWithDots } from "../../../util";
import { useAuthContext } from "../../AuthProvider";
import {
    getCampaign,
    getCategoryList,
    updateCampaign,
    createCampaign,
} from "Api";
import moment from "moment";
import { useEffect } from "react";
import { isEmpty } from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Buffer } from "buffer";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(4),
    },
    img: {
        width: "100%",
    },
    donationField: {
        width: 200,
    },
    sideMain: {
        display: "flex",
        flexDirection: "column",
    },
    interact: {
        "& *": {
            marginRight: 50,
        },
    },
    bottomSec: {
        backgroundColor: "#eceff1",
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        padding: 20,
    },
    similarSec: { paddingLeft: 50 },
}));

const initData = {
    isUnloaded: true,
    name: "",
    description: "",
    document: null,
    limit: 0,
    campaigns: [],
    createdOn: moment().format(),
    expiresOn: moment().add(10, "days").calendar(),
    category: "",
};

export default function CampaignPublic() {
    const [data, setData] = useState(initData);
    const { campaignId } = useParams();
    const { state, dispatch } = useAuthContext();
    const classes = useStyles();
    const status = state.status;

    const campaign = campaigns.find((c) => c.id === parseInt(campaignId));
    const campaign3 = campaigns.filter((c) => c.id !== parseInt(campaignId));

    const getCampaignData = useCallback(() => {
        getCampaign(campaignId, dispatch);
    }, [campaignId]);

    useLayoutEffect(() => {
        // console.log(campaignId);
        if (campaignId) getCampaignData();
    }, [campaignId]);

    useEffect(() => {
        if (status.getCampaignSuccess && data.isUnloaded) {
            const campaign = state.campaign;
            const document = campaign.document || null;
            const category = campaign.category || {
                name: "Not-Found",
                id: "error",
            };
            const imgSrc = !isEmpty(document)
                ? `data:${document.contentType};base64,${new Buffer.from(
                      document.data
                  ).toString("base64")}`
                : "";
            setData({
                ...data,
                isUnloaded: false,
                name: campaign.name,
                description: campaign.description,
                limit: parseFloat(campaign.limit.toString()) || 0,
                category: category.name,
                document: imgSrc,
                createdAt: campaign.createdAt || data.createdAt,
                expiresAt: campaign.expiresAt || data.expiresAt,
            });
        }
    }, [state]);

    console.log(data);
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md" className={classes.root}>
                {status.getCampaignInProgress && (
                    <Container maxWidth="sm">
                        <Box justifyContent="center" display="flex">
                            <CircularProgress />
                        </Box>
                    </Container>
                )}
                {status.getCampaignFailed && (
                    <Container maxWidth="sm">
                        <Typography
                            component="h5"
                            variant="h4"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                            style={{ wordWrap: "break-word" }}
                        >
                            Something went wrong. Please refresh and try again
                        </Typography>
                    </Container>
                )}
                {status.getCampaignSuccess && (
                    <>
                        <Box component="h1">{data.name}</Box>
                        <Grid container>
                            <Grid item sm={12} md={7}>
                                <Box mr={10}>
                                    <img
                                        className={classes.img}
                                        src={data.document}
                                        alt="campaign"
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={5} className={classes.sideMain}>
                                <Box component="h3">Date: </Box>
                                <Box component="h3">
                                    Donation Limit: ${data.limit}
                                </Box>
                                <Box display="flex" alignContent="flex-start">
                                    <Box>
                                        <FormControl
                                            fullWidth
                                            variant="outlined"
                                        >
                                            <InputLabel htmlFor="outlined-adornment-amount">
                                                Donate
                                            </InputLabel>
                                            <OutlinedInput
                                                type="number"
                                                className={
                                                    classes.donationField
                                                }
                                                id="outlined-adornment-amount"
                                                defaultValue="0"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        $
                                                    </InputAdornment>
                                                }
                                                labelWidth={60}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        marginLeft={2}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                        >
                                            Donate
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    height="100%"
                                    display="flex"
                                    alignItems="flex-end"
                                >
                                    <Box className={classes.interact}>
                                        <FavoriteBorderTwoToneIcon />
                                        <ShareIcon />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.bottomSec}>
                            <Grid item md={7}>
                                <Box component="h2">Description</Box>
                                <Box>
                                    <Typography variant="body1">
                                        {data.description}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={5}>
                                {/* <Box component="h2" className={classes.similarSec}>
                            Similar
                            {campaign3.map((c) => (
                                <Box key={c.id} component="li" fontSize={20}>
                                    <Link
                                        component={RouterLink}
                                        to={`/public-campaigns/${c.id}`}
                                    >
                                        {limitCharWithDots(c.name, 25)}
                                    </Link>
                                </Box>
                            ))}
                        </Box> */}
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </>
    );
}
