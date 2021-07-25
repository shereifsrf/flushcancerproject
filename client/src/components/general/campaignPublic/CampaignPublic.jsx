import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
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
    Divider,
    TextField,
    Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BG from "../../../images/island1.jpg";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";
import ShareIcon from "@material-ui/icons/Share";
import { campaigns } from "../../../dummyData";
import { Link as RouterLink, useParams } from "react-router-dom";
import { limitCharWithDots } from "../../../util";
import { useAuthContext } from "../../AuthProvider";
import { getCampaign, createDonation, createComment } from "Api";
import { useEffect } from "react";
import { isEmpty, mapValues } from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Buffer } from "buffer";
import { add, addMonths, format, formatDistance, subDays } from "date-fns";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import AlertDialog from "../AlertDialog";
import { deleteComment, updateComment } from "../../../api";

const getOtherOptions = (isEditable, element) => {
    let result = {};
    if (!isEditable) {
        if (element === "number") result = { readOnly: true };
        else result = { InputProps: { readOnly: true } };
    }
    return result;
};

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
    // interact: {
    //     "& *": {
    //         marginRight: 50,
    //     },
    // },
    bottomSec: {
        backgroundColor: "#eceff1",
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        padding: 20,
    },
    similarSec: { paddingLeft: 50 },
    button: {
        backgroundColor: "#FFF",
    },
}));

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
    buttonFn: undefined,
    other: undefined,
};

const initField = {};

const initData = {
    isUnloaded: true,
    name: "",
    description: "",
    document: null,
    limit: 0,
    createdAt: Date.now(),
    expiresAt: addMonths(new Date(), 5),
    category: { id: "", name: "" },
    user: { id: "", name: "" },
    totalDonation: 0,
    amount: 0,
    comments: null,
    comment: "",
    likable: false,
    totalLikes: 0,
};

export default function CampaignPublic() {
    const [data, setData] = useState(initData);
    const [field, setField] = useState(initField);
    const [alert, setAlert] = useState(initAlert);
    const { campaignId } = useParams();
    const { state, dispatch } = useAuthContext();
    const classes = useStyles();
    const status = state.status;

    const getCampaignData = useCallback(() => {
        getCampaign(campaignId, dispatch, true);
    }, [campaignId]);

    useLayoutEffect(() => {
        // console.log(campaignId);
        if (campaignId) getCampaignData();
    }, [campaignId]);

    useLayoutEffect(() => {
        if (!alert.open) {
            if (state.hasError) {
                // console.log("im here");
                setData({ ...data, isUnloaded: true });
                setAlert({
                    open: true,
                    title: "Error encountered",
                    contentText: state.message,
                    buttonText: "Alright",
                });
            } else if (status.createDonationSuccess) {
                setData({ ...data, isUnloaded: true });
                getCampaignData();
                setAlert({
                    open: true,
                    title: "Donation Status",
                    contentText: `Successfully donated ${state.donation.amount}`,
                    buttonText: "Great",
                });
            } else if (
                status.createCommentSuccess ||
                status.updateCommentSuccess ||
                status.deleteCommentSuccess
            ) {
                setData({ ...data, isUnloaded: true, comment: "" });
                getCampaignData();
            }
        }
    }, [state]);

    //for field
    // useEffect(() => {
    //     set
    // }, [field])

    useEffect(() => {
        if (status.getCampaignSuccess && data.isUnloaded) {
            const campaign = state.campaign;
            // console.log(campaign.totalDonation + data.amount);
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
                category: category || data.category,
                document: imgSrc,
                createdAt: campaign.createdAt || data.createdAt,
                expiresAt: campaign.expiresAt || data.expiresAt,
                user: campaign.user || data.user,
                totalDonation: campaign.totalDonation || 0,
                comments: campaign.comments || data.comments,
                totalLikes: campaign.totalLikes || data.totalLikes,
                likable: campaign.likable || data.likable,
            });
            const val = mapValues(_.keyBy(campaign.comments, "id"), "comment");
            setField(val);
        }
    }, [state, data]);

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    const handleDonate = () => {
        // console.log(data.amount);
        createDonation({ campaignId, amount: data.amount }, dispatch);
    };

    const handleComment = () => {
        // console.log(data.amount);
        createComment({ campaignId, comment: data.comment }, dispatch);
    };

    const handleCommentSave = (e) => {
        const key = e.currentTarget.name;
        // console.log(field[key]);
        updateComment(
            { body: { comment: field[key] }, commentId: key },
            dispatch
        );
    };

    const handleCommentDelete = (e) => {
        const key = e.currentTarget.name;
        setAlert({
            open: true,
            title: "Warning",
            contentText: `Are you sure to delete the comment? `,
            buttonText: "Yes",
            buttonFn: () => {
                handleAlertOpen();
                deleteComment(key, dispatch);
            },
            other: {
                secondaryButtonText: "No",
                secondaryButtonFn: () => handleAlertOpen(),
            },
        });
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleCommentChange = (e) => {
        // console.log(e.target.name);
        setField({ ...field, [e.target.name]: e.target.value });
    };

    // console.log(state);
    return (
        <>
            <CssBaseline />
            <AlertDialog
                open={alert.open}
                title={alert.title}
                contentText={alert.contentText}
                buttonText={alert.buttonText}
                buttonFn={alert.buttonFn || handleAlertOpen}
                other={alert.other}
            />
            <Container maxWidth="md" className={classes.root}>
                {(status.getCampaignInProgress ||
                    status.createDonationInProgress) && (
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
                        <Grid item xs={12} component="h1">
                            <Box mb={2}>{data.name}</Box>
                        </Grid>
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
                                <Box component="h3" my={1}>
                                    Expires On:{" "}
                                    {format(
                                        new Date(data.expiresAt),
                                        "dd/MM/yyyy"
                                    )}
                                </Box>
                                <Box component="h3" my={1}>
                                    Category: {data.category.name}
                                </Box>

                                <Box component="h3" my={1}>
                                    Donation Limit: ${data.limit}
                                </Box>

                                <Box component="h3" my={1} pb={3}>
                                    Total Donated: ${data.totalDonation}
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
                                                name="amount"
                                                onChange={handleChange}
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
                                            onClick={handleDonate}
                                            value={data.amount}
                                        >
                                            Donate
                                        </Button>
                                    </Box>
                                </Box>
                                <Box mt={2} display="flex" flexDirection="row">
                                    <Box>
                                        <FavoriteBorderTwoToneIcon />
                                    </Box>
                                    <Box>{data.totalLikes}</Box>
                                    <Box px={4}>
                                        <ShareIcon />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.bottomSec}>
                            <Grid container spacing={2} justify="space-between">
                                <Grid item>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Created:
                                        {` ${format(
                                            new Date(data.createdAt),
                                            "dd/MM/yyyy"
                                        )}`}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        By:
                                        {` ${data.user.name}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider style={{ backgroundColor: "#000" }} />
                            </Grid>
                            <Grid item xs={12} component="h2">
                                <Box mt={3}>Description: </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box px={5} display="flex">
                                    <Typography variant="body1">
                                        {data.description}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box mt={5} display="flex">
                                    <TextField
                                        label="Comments"
                                        name="comment"
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={data.comment}
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    mt={1}
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <Button
                                        color="primary"
                                        className={classes.button}
                                        onClick={handleComment}
                                        startIcon={<InsertCommentIcon />}
                                    >
                                        Comment
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                {data.comments &&
                                    data.comments.map((comment) => {
                                        return (
                                            <div key={comment.id}>
                                                <Grid
                                                    container
                                                    wrap="nowrap"
                                                    spacing={2}
                                                >
                                                    <Grid item>
                                                        <Avatar
                                                            alt="Remy Sharp"
                                                            src={""}
                                                        />
                                                    </Grid>
                                                    <Grid item xs zeroMinWidth>
                                                        <h4
                                                            style={{
                                                                margin: 0,
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                        >
                                                            {comment.user.name}
                                                        </h4>
                                                        <TextField
                                                            id="standard-multiline-static"
                                                            label=""
                                                            name={comment.id}
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            rowsMax={10}
                                                            onChange={
                                                                handleCommentChange
                                                            }
                                                            value={
                                                                field[
                                                                    comment.id
                                                                ]
                                                            }
                                                            variant="outlined"
                                                            {...getOtherOptions(
                                                                comment.editable,
                                                                "text"
                                                            )}
                                                        />
                                                        <p
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                                color: "gray",
                                                            }}
                                                        >
                                                            posted{" "}
                                                            {formatDistance(
                                                                Date.parse(
                                                                    comment.createdAt
                                                                ),
                                                                new Date(),
                                                                {
                                                                    addSuffix: true,
                                                                }
                                                            )}
                                                        </p>
                                                    </Grid>
                                                </Grid>
                                                {comment.editable && (
                                                    <Grid
                                                        container
                                                        justify="flex-end"
                                                        spacing={2}
                                                    >
                                                        <Grid item>
                                                            <Button
                                                                name={
                                                                    comment.id
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={
                                                                    handleCommentSave
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                name={
                                                                    comment.id
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={
                                                                    handleCommentDelete
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                                <Divider
                                                    variant="fullWidth"
                                                    style={{ margin: "30px 0" }}
                                                />
                                            </div>
                                        );
                                    })}
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </>
    );
}
