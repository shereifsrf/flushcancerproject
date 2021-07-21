import React, { useCallback, useState } from "react";
import {
    CssBaseline,
    Container,
    Typography,
    Divider,
    TextField,
    OutlinedInput,
    InputLabel,
    FormControl,
    InputAdornment,
    Button,
    Card,
    Grid,
    Box,
    MenuItem,
    Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUpload, Tune } from "@material-ui/icons";
import { campaigns } from "../../../dummyData";
import { useHistory, useParams } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";
import { isEmpty } from "lodash";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import { useEffect } from "react";
import { useAuthContext } from "../../AuthProvider";
import {
    getCampaign,
    getCategoryList,
    updateCampaign,
    createCampaign,
} from "Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLayoutEffect } from "react";
import { Buffer } from "buffer";
import { useRef } from "react";
import { CAMPAIGNS_URL, DASHBOARD_URL } from "../../../constants";
import AlertDialog from "../../general/AlertDialog";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    root: {
        marginTop: theme.spacing(8),
    },
    form: {
        marginBottom: theme.spacing(8),
        "& > *": {
            marginBottom: theme.spacing(2),
        },
    },
    input: {
        display: "none",
    },
    image: {
        width: "100%",
    },
    coverImage: {
        marginTop: theme.spacing(2),
    },
}));

const initialState = {
    name: "",
    description: "",
    limit: 0,
    category: "",
    document: null,
    isVerifyDocument: true,
    editable: false,
    categories: null,
    imageChanged: false,
    newImage: null,
};

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
};

const getOtherOptions = (isEditable, element) => {
    // console.log(e);
    let result = {};
    if (!isEditable) {
        if (element === "number") result = { readOnly: true };
        else result = { InputProps: { readOnly: true } };
    }
    return result;
};

export default function Campaign() {
    const [data, setData] = useState(initialState);
    const [alert, setAlert] = useState(initAlert);
    const { state, dispatch } = useAuthContext();
    const history = useHistory();
    const classes = useStyles();
    const { campaignId } = useParams();
    const getCampaignData = useCallback(() => {
        getCampaign(campaignId, dispatch);
    }, [campaignId]);
    // const campaign = campaigns.find((c) => c.id === parseInt(campaignId)) || {};
    const isCreate = !campaignId;
    const isEdit = false;
    const imgSrc = useRef("");
    const status = state.status;

    useLayoutEffect(() => {
        // console.log(campaignId);
        if (campaignId) getCampaignData();
    }, [campaignId]);

    useLayoutEffect(() => {
        if (
            isEditable() &&
            isEmpty(state.categories) &&
            !state.status.getCategoryListInProgress
        ) {
            getCategoryList(dispatch);
        }

        if (
            isEditable() &&
            !isEmpty(state.categories) &&
            isEmpty(data.categories)
        ) {
            // console.log(state.categories);
            setData({ ...data, categories: state.categories });
        }
    }, [state, data]);

    useLayoutEffect(() => {
        if (!alert.open) {
            if (state.hasError) {
                console.log("im here");
                setAlert({
                    open: true,
                    title: "Error encountered",
                    contentText: state.message,
                    buttonText: "Alright",
                });
            } else if (state.status.createCampaignSuccess) {
                setAlert({
                    open: true,
                    title: "Campaign Created",
                    contentText: `Campaign '${state.campaign.name}' successfully created `,
                    buttonText: "Great",
                });
            } else if (state.status.updateCampaignSuccess) {
                setAlert({
                    open: true,
                    title: "Campaign updated",
                    contentText: `Campaign '${state.campaign.name}' successfully updated `,
                    buttonText: "Great",
                });
            }
        }
    }, [state]);

    useLayoutEffect(() => {
        if (isCreate) setData({ ...initialState, name: "" });
    }, [isCreate]);

    const handleChange = (e) => {
        switch (e.target.name) {
            case "coverImage":
                // console.log("yes, image changed brother");
                // console.log(undefined ? true : false);
                const selectedFile =
                    e.target.files.length > 0 ? e.target.files[0] : null;
                const objectUrl = selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : null;
                setData({
                    ...data,
                    imageChanged: true,
                    newImage: objectUrl,
                    document: selectedFile,
                });
                break;
            default:
                setData({ ...data, [e.target.name]: e.target.value });
                break;
        }
    };

    useEffect(() => {
        if (!isEditable()) {
            if (
                status.getCampaignSuccess ||
                status.createCampaignSuccess ||
                status.updateCampaignSuccess
            ) {
                const campaign = state.campaign;
                const document = campaign.document || null;
                const category = campaign.category || {
                    name: "Not-Found",
                    id: "error",
                };
                // console.log(isEmpty(document));
                setData({
                    ...data,
                    name: campaign.name,
                    description: campaign.description,
                    limit: parseFloat(campaign.limit.toString()) || 0,
                    document,
                    editable: campaign.editable || false,
                    isVerifyDocument: campaign.isVerifyDocument,
                    category,
                    newImage: null,
                });
                imgSrc.current = !isEmpty(document)
                    ? `data:${document.contentType}; base64,${new Buffer.from(
                          document.data
                      ).toString("base64")}`
                    : imgSrc.current;
                // console.log(imgSrc.current);
            }
        }
    }, [isCreate, state]);

    const isEditable = () => {
        return isEdit || data.editable || isCreate;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(data);
        if (!isCreate) updateCampaign(campaignId, data, dispatch);
        else createCampaign(data, dispatch);
    };

    const handleCancel = (e) => {
        history.push(`/${DASHBOARD_URL}`);
    };

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                {/*loading*/}
                {(status.getCampaignInProgress ||
                    status.createCampaignInProgress ||
                    status.updateCampaignInProgress) && (
                    <Container maxWidth="sm">
                        <Box justifyContent="center" display="flex">
                            <CircularProgress />
                        </Box>
                    </Container>
                )}
                {/*name or error header*/}
                {status.getCampaignFailed && (
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                            style={{ wordWrap: "break-word" }}
                        >
                            Something went wrong. Please refresh and try again
                        </Typography>
                    </Container>
                )}
                {/*form*/}
                {!(
                    status.getCampaignInProgress ||
                    status.createCampaignInProgress ||
                    status.updateCampaignInProgress
                ) && (
                    <>
                        {/*name*/}
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            method="post"
                        >
                            <Container maxWidth="sm" className={classes.form}>
                                {!isCreate && (
                                    <Typography
                                        component="h1"
                                        variant="h2"
                                        align="center"
                                        color="textPrimary"
                                        gutterBottom
                                        style={{ wordWrap: "break-word" }}
                                    >
                                        {data.name}
                                    </Typography>
                                )}
                                <Typography
                                    variant="h5"
                                    align="center"
                                    color="textSecondary"
                                    paragraph
                                >
                                    {`${
                                        !isCreate ? "View/Edit" : "Create"
                                    } the campaign here`}
                                </Typography>
                                {!isEmpty(data.document) && (
                                    <img
                                        className={classes.image}
                                        src={imgSrc.current}
                                    />
                                )}
                                <div>
                                    <TextField
                                        id="outlined-multiline-flexible"
                                        label="Name"
                                        name="name"
                                        fullWidth
                                        multiline
                                        rowsMax={2}
                                        value={data.name}
                                        variant="outlined"
                                        onChange={handleChange}
                                        {...getOtherOptions(
                                            isEditable(),
                                            "text"
                                        )}
                                    />
                                    {isEditable() && (
                                        <div className={classes.coverImage}>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                name="coverImage"
                                                id="label-cover-image"
                                                multiple
                                                type="file"
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="label-cover-image">
                                                <Button
                                                    variant="contained"
                                                    color="default"
                                                    className={classes.button}
                                                    startIcon={<CloudUpload />}
                                                    component="span"
                                                    // fullWidth
                                                >
                                                    {!isCreate
                                                        ? "Change"
                                                        : "Upload"}{" "}
                                                    Cover Image
                                                </Button>
                                            </label>
                                        </div>
                                    )}
                                </div>
                                {data.newImage && (
                                    <img
                                        className={classes.image}
                                        src={data.newImage}
                                    />
                                )}
                                {
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        // className={classes.formControl}
                                    >
                                        {isEditable() &&
                                            state.status
                                                .getCategoryListSuccess &&
                                            data.categories && (
                                                <>
                                                    <InputLabel id="label-category">
                                                        Select Category
                                                    </InputLabel>
                                                    <Select
                                                        labelId="label-category"
                                                        name="category"
                                                        value={
                                                            data.category
                                                                ? data.category
                                                                      .id
                                                                : ""
                                                        }
                                                        label="Select Category"
                                                        onChange={handleChange}
                                                    >
                                                        {data.categories.map(
                                                            (category) => {
                                                                return (
                                                                    <MenuItem
                                                                        key={
                                                                            category.id
                                                                        }
                                                                        value={
                                                                            category.id
                                                                        }
                                                                    >
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </MenuItem>
                                                                );
                                                            }
                                                        )}
                                                    </Select>
                                                </>
                                            )}
                                        {state.status
                                            .getCategoryListInProgress && (
                                            <Box
                                                justifyContent="center"
                                                display="flex"
                                            >
                                                <CircularProgress />
                                            </Box>
                                        )}
                                        {state.status.getCategoryListFailed &&
                                            "Failed to load"}
                                        {!isEditable() && (
                                            <TextField
                                                label="category"
                                                name="category"
                                                fullWidth
                                                rowsMax={2}
                                                value={data.category.name}
                                                variant="outlined"
                                            />
                                        )}
                                    </FormControl>
                                }

                                <div>
                                    <TextField
                                        id="standard-multiline-static"
                                        label="Decription"
                                        name="description"
                                        fullWidth
                                        multiline
                                        rowsMax={10}
                                        value={data.description}
                                        variant="outlined"
                                        onChange={handleChange}
                                        {...getOtherOptions(
                                            isEditable(),
                                            "text"
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormControl
                                        fullWidth
                                        // className={classes.margin}
                                        variant="outlined"
                                    >
                                        <InputLabel>Donation Limit</InputLabel>
                                        <OutlinedInput
                                            type="number"
                                            name="limit"
                                            id="outlined-adornment-amount"
                                            value={data.limit}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    $
                                                </InputAdornment>
                                            }
                                            labelWidth={60}
                                            label="Donation Limit"
                                            onChange={handleChange}
                                            {...getOtherOptions(
                                                isEditable(),
                                                "number"
                                            )}
                                        />
                                    </FormControl>
                                </div>
                                <Divider className={classes.divider} />
                                {isEditable() && data.isVerifyDocument && (
                                    <div>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            id="label-campaign-proof"
                                            multiple
                                            type="file"
                                        />
                                        <label htmlFor="label-campaign-proof">
                                            <Button
                                                variant="contained"
                                                color="default"
                                                className={classes.button}
                                                startIcon={<CloudUpload />}
                                                component="span"
                                                // fullWidth
                                            >
                                                Upload Campaign Proof Documents
                                            </Button>
                                        </label>
                                    </div>
                                )}
                                {isEditable() && (
                                    <Grid
                                        container
                                        spacing={2}
                                        justify="space-between"
                                    >
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                startIcon={
                                                    !isCreate ? (
                                                        <SaveIcon />
                                                    ) : (
                                                        <AddCircleOutlineIcon />
                                                    )
                                                }
                                            >
                                                {`${
                                                    !isCreate
                                                        ? "Save Changes"
                                                        : "create Campaign"
                                                }`}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleCancel}
                                                startIcon={
                                                    <CancelPresentationIcon />
                                                }
                                            >
                                                {`Cancel ${
                                                    !isCreate
                                                        ? "Changes"
                                                        : "Campaign"
                                                }`}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Container>
                        </form>
                        <AlertDialog
                            open={alert.open}
                            title={alert.title}
                            contentText={alert.contentText}
                            buttonText={alert.buttonText}
                            buttonFn={handleAlertOpen}
                        />
                    </>
                )}
            </div>
        </>
    );
}
