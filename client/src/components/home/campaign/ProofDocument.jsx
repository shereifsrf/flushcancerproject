import { Box, Button, CircularProgress, makeStyles } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import { Buffer } from "buffer";
import { differenceInDays } from "date-fns";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useLayoutEffect } from "react";
import { createProof, deleteProof, getProofList } from "../../../api";
import { useAuthContext } from "../../AuthProvider";
import AlertDialog from "../../general/AlertDialog";
const useStyles = makeStyles((theme) => ({
    input: {
        display: "none",
    },
    image: {
        width: "100%",
    },
}));

const initData = {
    loading: false,
    proofs: [],
    proofToDelete: "",
};

const initAlert = {
    open: false,
    title: "",
    contentText: "",
    buttonText: "",
    buttonFn: undefined,
    other: undefined,
};

export default function ProofDocument({ campaignId, verified }) {
    const classes = useStyles();
    const { state, dispatch } = useAuthContext();
    const [alert, setAlert] = useState(initAlert);
    const [data, setData] = useState(initData);

    useLayoutEffect(() => {
        getProofList(campaignId, dispatch);
        setData({ ...data, loading: true });
    }, []);

    useLayoutEffect(() => {
        if (data.loading) {
            if (state.status.getProofListSuccess) {
                // console.log(state.proofs);
                setData({
                    ...data,
                    proofs: state.proofs.map((proof) => {
                        return {
                            imgSrc: getImgSrc(proof.document),
                            id: proof.id,
                            createdAt: proof.createdAt,
                        };
                    }),
                    loading: false,
                });
            } else if (state.status.createProofSuccess) {
                const proof = state.proof;
                const imgSrc = getImgSrc(proof.document);
                setData({
                    ...data,
                    proofs: [
                        ...data.proofs,
                        { imgSrc, id: proof.id, createdAt: proof.createdAt },
                    ],
                    loading: false,
                });
                setAlert({
                    open: true,
                    title: "Confirmation",
                    contentText: `Uploaded Proof Document successfully `,
                    buttonText: "Thanks",
                });
            } else if (state.status.deleteProofSuccess) {
                setData({
                    ...data,
                    proofs: data.proofs.filter(
                        (proof) => proof.id !== data.proofToDelete
                    ),
                    loading: false,
                });
                setAlert({
                    open: true,
                    title: "Confirmation",
                    contentText: `Deleted Proof Document successfully `,
                    buttonText: "Alright",
                });
            }
        }
    }, [state]);

    const handleDelete = (e) => {
        const proofToDelete = e.currentTarget.name;
        setAlert({
            open: true,
            title: "Warning",
            contentText: `Are you sure to delete the proof? `,
            buttonText: "Yes",
            buttonFn: () => {
                handleAlertOpen();
                deleteProof(proofToDelete, dispatch);
                setData({
                    ...data,
                    loading: true,
                    proofToDelete: proofToDelete,
                });
            },
            other: {
                secondaryButtonText: "No",
                secondaryButtonFn: () => handleAlertOpen(),
            },
        });
    };

    const getImgSrc = (document) => {
        // console.log(document);
        return !isEmpty(document)
            ? `data:${document.contentType}; base64,${new Buffer.from(
                  document.data
              ).toString("base64")}`
            : "";
    };

    const handleChange = (e) => {
        const selectedFile =
            e.target.files.length > 0 ? e.target.files[0] : null;
        if (selectedFile) {
            setData({ ...data, loading: true });
            createProof(campaignId, selectedFile, dispatch);
        }
    };

    const handleAlertOpen = () => {
        setAlert((alert) => ({ ...alert, open: !alert.open }));
    };

    // console.log(data.proofs);
    return (
        <div>
            <AlertDialog
                open={alert.open}
                title={alert.title}
                contentText={alert.contentText}
                buttonText={alert.buttonText}
                buttonFn={alert.buttonFn || handleAlertOpen}
                other={alert.other}
            />
            {data.loading && (
                <Box justifyContent="center" display="flex">
                    <CircularProgress />
                </Box>
            )}
            {!data.loading && (
                <Box>
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="label-campaign-proof"
                        multiple
                        type="file"
                        onChange={handleChange}
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
                </Box>
            )}
            <Box pt={2}>
                {!isEmpty(data.proofs) &&
                    data.proofs.map((proof) => {
                        return (
                            <Box key={proof.id} mb={2}>
                                <img
                                    className={classes.image}
                                    src={proof.imgSrc}
                                />{" "}
                                {differenceInDays(
                                    new Date(proof.createdAt),
                                    Date.now()
                                ) > -1 &&
                                    !verified && (
                                        <Box
                                            display="flex"
                                            justifyContent="flex-end"
                                        >
                                            <Button
                                                color="secondary"
                                                variant="outlined"
                                                name={proof.id}
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    )}
                            </Box>
                        );
                    })}
            </Box>
        </div>
    );
}
