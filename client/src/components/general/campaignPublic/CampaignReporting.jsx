import { Box, TextField, Typography, Button } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { useAuthContext } from "../../AuthProvider";
import CircularProgress from "@material-ui/core/CircularProgress";
import AlertDialog from "../AlertDialog";
import { createReporting } from "../../../api";
import { render } from "@testing-library/react";

const initReporting = {
    message: "",
    loading: false,
};

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
    buttonFn: undefined,
    other: undefined,
};

export default function CampaignReport({ campaignId, campaign }) {
    const [reporting, setReporting] = useState(initReporting);
    const { state, dispatch } = useAuthContext();
    const [alert, setAlert] = useState(initAlert);
    const status = state.status;

    useLayoutEffect(() => {
        if (reporting.loading) {
            if (status.createReportingSuccess) {
                setReporting(initReporting);
                // console.log("herer");
                if (!alert.open) {
                    setAlert({
                        open: true,
                        title: "Report Sent",
                        contentText: `You have reported the campaign '${campaign.name}'`,
                        buttonText: "Alright",
                    });
                }
            }
        }
    }, [state]);

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    const handleChange = (e) => {
        setReporting({ ...reporting, message: e.target.value });
    };

    const handleReportButton = () => {
        setReporting({ ...reporting, loading: true });
        createReporting({ campaignId, message: reporting.message }, dispatch);
    };

    // console.log(campaignId);

    return (
        <Box>
            <AlertDialog
                open={alert.open}
                title={alert.title}
                contentText={alert.contentText}
                buttonText={alert.buttonText}
                buttonFn={alert.buttonFn || handleAlertOpen}
                other={alert.other}
            />
            <Typography variant="h5" gutterBottom>
                Report
            </Typography>
            <Box>
                <TextField
                    label="Type here"
                    name="comment"
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    value={reporting.message}
                    variant="outlined"
                />
            </Box>
            <Box mt={1} display="flex" justifyContent="flex-end">
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleReportButton}
                >
                    Report
                    {reporting.loading && (
                        <>
                            {"  "} <CircularProgress size={20} />
                        </>
                    )}
                </Button>
            </Box>
        </Box>
    );
}
