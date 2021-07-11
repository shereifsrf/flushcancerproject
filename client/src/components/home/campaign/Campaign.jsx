import React, { useState } from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CloudUpload } from "@material-ui/icons";
import { campaigns } from "../../../dummyData";
import { useParams } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";
import { isEmpty } from "lodash";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    root: {
        marginTop: theme.spacing(8),
    },
    form: {
        marginTop: theme.spacing(8),
        "& > *": {
            marginBottom: theme.spacing(2),
        },
    },
    input: {
        display: "none",
    },
}));

const initialState = {
    name: "",
    description: "",
    hasDocument: false,
    limit: 0,
};

export default function Campaign() {
    const [data, setData] = useState(initialState);
    const classes = useStyles();
    const { campaignId } = useParams();
    const campaign = campaigns.find((c) => c.id === parseInt(campaignId)) || {};
    const isCreate = !campaignId && isEmpty(campaign);

    //initial setup
    useEffect(() => {
        if (!isCreate) {
            setData({
                ...data,
                name: campaign.name,
                description: campaign.description,
                limit: campaign.limit,
            });
        } else {
            setData({
                ...initialState,
            });
        }
    }, [isCreate]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    // console.log(isCreate);
    return (
        <>
            <CssBaseline />
            <div className={classes.root}>
                <Container maxWidth="sm">
                    {!isCreate && (
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            {campaign.name}
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
                </Container>
                <form noValidate autoComplete="off">
                    <Container maxWidth="sm" className={classes.form}>
                        <div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Name"
                                name="name"
                                multiline
                                rowsMax={4}
                                value={data.name}
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <TextField
                                id="standard-multiline-static"
                                label="Decription"
                                name="decription"
                                fullWidth
                                multiline
                                rows={4}
                                value={data.description}
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                            />
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="contained"
                                    color="default"
                                    className={classes.button}
                                    startIcon={<CloudUpload />}
                                    component="span"
                                >
                                    Upload Documents
                                </Button>
                            </label>
                        </div>
                        <div>
                            <FormControl
                                fullWidth
                                className={classes.margin}
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-adornment-amount">
                                    Donation Limit
                                </InputLabel>
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
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </div>
                        <Divider className={classes.divider} />
                        <Grid container spacing={2} justify="space-between">
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={
                                        !isCreate ? (
                                            <SaveIcon />
                                        ) : (
                                            <AddCircleOutlineIcon />
                                        )
                                    }
                                >
                                    {`${
                                        !isCreate ? "Save" : "create"
                                    } Campaign`}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<CancelPresentationIcon />}
                                >
                                    {`Cancel ${
                                        !isCreate ? "Changes" : "Campaign"
                                    }`}
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </form>
            </div>
        </>
    );
}
